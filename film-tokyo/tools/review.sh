#!/bin/sh
# Contact sheet (2 fps), 10 fps strips across the unfold, the dive, every cut, each season wipe and the fold, and the
# first frames, from the final MP4.   usage: sh tools/review.sh renders/tokyo-redrawn.mp4 evidence/review
set -e
V=$1; O=${2:-evidence/review}; FF=${FFMPEG:-ffmpeg}
mkdir -p "$O"
$FF -v error -y -i "$V" -vf "fps=2,scale=270:-1,tile=8x8" -frames:v 1 "$O/sheet.png"
strip() { $FF -v error -y -ss "$2" -t "$3" -i "$V" -vf "fps=10,scale=270:-1,tile=10x$4" -frames:v 1 "$O/$1.png"; }
strip open 0.2 4.6 5
strip dive 4.7 2.6 3
strip seasons 18.4 6 6
strip close 24.4 3 3
for c in 7.2 8.4 9.6 10.8 12.0 13.2 14.4 15.6 16.8 18.0 24.6 26.4; do
  s=$(echo "$c - 0.4" | bc)
  $FF -v error -y -ss "$s" -t 1 -i "$V" -vf "fps=10,scale=270:-1,tile=10x1" -frames:v 1 "$O/cut-$c.png"
done
$FF -v error -y -i "$V" -vf "select='lt(n,12)',scale=270:-1,tile=12x1" -frames:v 1 "$O/first-frames.png"
echo "$O"
