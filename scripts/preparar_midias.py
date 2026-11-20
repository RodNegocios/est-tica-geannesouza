"""Prepara as versões para a web a partir do acervo original deste repositório."""
from pathlib import Path
import json
import re
import shutil
import unicodedata
import subprocess

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "public" / "media"
PHOTOS = {
    'renda-e-veu': 'Noiva Radiante em Renda e Véu.png',
    'robe-de-cetim': 'Retrato Bridal com Robe de Cetim Branco.png',
    'buque-vermelho': 'SaveClip.App_483013391_18492652456031090_17938603204238307_n.jpg',
    'retrato-florido': 'SaveClip.App_499793572_1010978551246319_8053241611780899505_n.jpg',
    'noiva-01-veu': 'cliente1/Screenshot 2026-11-20 at 10-40-46 (1) Instagram.png',
    'noiva-01-maquiagem': 'cliente1/Screenshot 2026-11-20 at 10-40-50 (1) Instagram.png',
    'noiva-01-penteado': 'cliente1/Screenshot 2026-11-20 at 10-40-52 (1) Instagram.png',
    'noiva-01-buque': 'cliente1/Screenshot 2026-11-20 at 10-40-55 (1) Instagram.png',
    'noiva-01-detalhe': 'cliente1/Screenshot 2026-11-20 at 10-40-59 (1) Instagram.png',
    'noiva-01-retrato': 'cliente1/Screenshot 2026-11-20 at 10-41-03 (1) Instagram.png',
    'vestido-cauda': 'cliente2/Screenshot 2026-11-20 at 10-44-44 (1) Instagram.png',
    'retrato-cachos': 'cliente2/Screenshot 2026-11-20 at 10-44-47 (1) Instagram.png',
    'penteado-cachos': 'cliente2/Screenshot 2026-11-20 at 10-44-49 (1) Instagram.png',
    'vestido-e-janela': 'cliente2/Screenshot 2026-11-20 at 10-44-54 (1) Instagram.png',
    'robe-noiva': 'cliente2/Screenshot 2026-11-20 at 10-44-57 (1) Instagram.png',
    'casal-04': 'cliente4/SaveClip.App_499375952_18505944619031090_5730178124746516161_n.jpg',
    'fachada': 'imagem para hero do site com efeito em camada.png',
}
FILMS = {
    "antes-do-altar": ("cliente 3", 12.4),
    "entre-risos": ("cliente2", 5.1),
    "mesa-do-spa": ("vídeo da comidas servidas durante os atendiemnto", 5.7),
}


def prepare_photos():
    for name, source in PHOTOS.items():
        with Image.open(ROOT / source) as original:
            image = ImageOps.exif_transpose(original).convert("RGB")
        variants = [(1647, ""), (850, "-850")] if name == "fachada" else [(1100, ""), (480, "-480")]
        for width, suffix in variants:
            path = DEST / f"{name}{suffix}.webp"
            version = image.copy()
            version.thumbnail((width, width * 2))
            version.save(path, "WEBP", quality=85, method=5)


def prepare_films():
    for name, (folder, poster_time) in FILMS.items():
        originals = sorted((ROOT / folder).glob("*.mp4"))
        if len(originals) != 1:
            raise ValueError(f"É necessário identificar um vídeo em {folder}")
        source = originals[0]
        shutil.copyfile(source, DEST / f"{name}.mp4")
        subprocess.run([
            "ffmpeg", "-loglevel", "error", "-y", "-ss", str(poster_time),
            "-i", str(source), "-frames:v", "1", "-vf", "scale=540:-2",
            "-quality", "84", str(DEST / f"{name}.webp"),
        ], check=True)


def read_story(folder):
    files = list((ROOT / folder).glob("*.txt"))
    if len(files) != 1:
        raise ValueError(f"É necessário identificar um relato em {folder}.")
    raw = files[0].read_text(encoding="utf-8-sig")
    cleaned = "".join(c for c in raw if unicodedata.category(c) not in {"So", "Sk"} and c not in "\ufe0f\u200d")
    return [line.strip() for line in cleaned.splitlines() if line.strip() and "@" not in line]


def write_stories():
    # Keep the original stories in their existing folders. Prepare the displayed
    # excerpts locally in the same build step that prepares the photographs.
    first, second, third, fourth = [read_story(folder) for folder in ("cliente1", "cliente2", "cliente 3", "cliente4")]
    first_name = re.search(r"\bA (\w+) chegou", " ".join(first))
    couple = re.search(r"^([A-ZÀ-Ý]\w+ e [A-ZÀ-Ý]\w+),", "\n".join(fourth), re.MULTILINE)
    entries = [
        dict(title="O dia de " + first_name[1] if first_name else "O dia da noiva",
             category="Maquiagem e penteado", images=["noiva-01-veu", "noiva-01-buque"],
             alt=["Noiva de costas, com o véu aberto junto à janela", "Noiva com o buquê e o penteado do casamento"],
             excerpt=first[3], details=[first[2], first[3], first[8], first[9]]),
        dict(title="Entre risos e cachos", category="Spa da Noiva", images=["retrato-cachos", "vestido-cauda"],
             alt=["Noiva de robe com maquiagem pronta e cachos soltos", "Noiva pronta com vestido de cauda"],
             video="entre-risos", excerpt=" ".join(second[:2]), details=[" ".join(second[:3]), " ".join(second[3:6])]),
        dict(title="Antes do altar", category="Relato da noiva", images=["antes-do-altar"],
             alt=["Noiva de vestido e véu com o buquê nas mãos"], video="antes-do-altar",
             excerpt=third[0].split(". ")[0].rstrip(".")+".", details=third[:2]),
        dict(title=couple[1] if couple else "O encontro do casal", category="Dia do casamento",
             images=["casal-04"], alt=["O casal abraçado sob as luzes do casamento"],
             excerpt=fourth[2], details=[" ".join(fourth[1:4]),fourth[5]])
    ]
    output = ROOT / "src" / "generated" / "stories.json"
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps({"stories":entries}, ensure_ascii=False, indent=2), encoding="utf-8")


if __name__ == "__main__":
    DEST.mkdir(parents=True, exist_ok=True)
    prepare_photos()
    prepare_films()
    write_stories()
