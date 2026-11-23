#!/bin/sh
# Contact sheet (2 fps), a 10 fps strip across the switch and across every cut, and the first frames, from the final MP4.
# usage: sh tools/review.sh renders/press-n.mp4 evidence/review
set -e
V=$1; O=${2:-evidence/review}; FF=${FFMPEG:-ffmpeg}
mkdir -p "$O"
$FF -v error -y -i "$V" -vf "fps=2,scale=270:-1,tile=8x8" -frames:v 1 "$O/sheet.png"
$FF -v error -y -ss 1.7 -t 2 -i "$V" -vf "fps=10,scale=270:-1,tile=10x2" -frames:v 1 "$O/switch.png"
for c in 7.5 10.0 11.25 12.5 13.75 15.0 16.25 17.5 18.75 20.0 21.25 22.5 23.75 27.5; do
  s=$(echo "$c - 0.4" | bc)
  $FF -v error -y -ss "$s" -t 1 -i "$V" -vf "fps=10,scale=270:-1,tile=10x1" -frames:v 1 "$O/cut-$c.png"
done
$FF -v error -y -ss 24.2 -t 2 -i "$V" -vf "fps=10,scale=270:-1,tile=10x2" -frames:v 1 "$O/grid-wave.png"
$FF -v error -y -i "$V" -vf "select='lt(n,12)',scale=270:-1,tile=12x1" -frames:v 1 "$O/first-frames.png"
echo "$O"
