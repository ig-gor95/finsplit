#!/usr/bin/env python3
"""
Скрипт для автоматического исправления импортов с версиями
"""
import os
import re
from pathlib import Path

def fix_imports_in_file(file_path):
    """Исправляет импорты в одном файле"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Исправить @radix-ui импорты
    content = re.sub(r'@radix-ui/([^@"\']+)@[\d.]+', r'@radix-ui/\1', content)
    
    # Исправить lucide-react импорты
    content = re.sub(r'lucide-react@[\d.]+', 'lucide-react', content)
    
    # Исправить next-themes импорты
    content = re.sub(r'next-themes@[\d.]+', 'next-themes', content)
    
    # Исправить sonner импорты (если остались)
    content = re.sub(r'sonner@[\d.]+', 'sonner', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    """Главная функция"""
    src_dir = Path('src')
    
    if not src_dir.exists():
        print("❌ Директория src не найдена!")
        return
    
    fixed_count = 0
    
    # Ищем все .tsx и .ts файлы
    for file_path in src_dir.rglob('*.tsx'):
        if fix_imports_in_file(file_path):
            print(f"✅ Исправлено: {file_path}")
            fixed_count += 1
    
    for file_path in src_dir.rglob('*.ts'):
        if fix_imports_in_file(file_path):
            print(f"✅ Исправлено: {file_path}")
            fixed_count += 1
    
    print(f"\n🎉 Готово! Исправлено файлов: {fixed_count}")
    print("\nТеперь запустите: npm run dev")

if __name__ == '__main__':
    main()

