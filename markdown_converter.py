import os
import sys

from markitdown import MarkItDown


def main():
    if len(sys.argv) != 2:
        print("Usage: python markdown_converter.py <path-to-file>")
        sys.exit(1)

    file_path = sys.argv[1]
    if not os.path.isfile(file_path):
        print("El archivo especificado no existe.")
        sys.exit(1)

    md = MarkItDown()
    result = md.convert(file_path)
    print(result.text_content)


if __name__ == "__main__":
    main()
