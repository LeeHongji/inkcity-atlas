"""Start a scene: copy the starter (a small town that already plays and explores) and the engine into a new folder.
usage: python3 new_scene.py <folder>"""
import os, shutil, sys
if len(sys.argv) != 2: sys.exit(__doc__)
dst = os.path.abspath(sys.argv[1]); skill = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if os.path.exists(os.path.join(dst, 'dev.html')): sys.exit('already a scene: ' + dst)
shutil.copytree(os.path.join(skill, 'assets', 'starter'), dst, dirs_exist_ok=True)
for f in sorted(os.listdir(os.path.join(skill, 'assets', 'engine'))):
    shutil.copy(os.path.join(skill, 'assets', 'engine', f), os.path.join(dst, 'src', f))
print('scene at', dst)
for root, _, files in sorted(os.walk(dst)):
    for f in sorted(files): print('  ', os.path.relpath(os.path.join(root, f), dst))
