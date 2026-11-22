#!/bin/sh
# Contact sheets (2 fps, two halves), a 10 fps strip across every cut, and the first frames, from the final MP4.
# usage: sh tools/review.sh renders/inkcity-atlas-promo.mp4 evidence/review
set -e
V=$1; O=${2:-evidence/review}; FF=${FFMPEG:-ffmpeg}
mkdir -p "$O"
$FF -v error -y -i "$V" -vf "fps=2,scale=384:-1,tile=6x8" -frames:v 1 "$O/sheet-a.png"
$FF -v error -y -ss 24 -i "$V" -vf "fps=2,scale=384:-1,tile=6x8" -frames:v 1 "$O/sheet-b.png"
for c in 4.8 7.8 10.2 13.2 15.6 18.6 21.0 29.4 34.2 39.0; do
  s=$(echo "$c - 0.4" | bc)
  $FF -v error -y -ss "$s" -t 1 -i "$V" -vf "fps=10,scale=320:-1,tile=10x1" -frames:v 1 "$O/cut-$c.png"
done
$FF -v error -y -i "$V" -vf "select='lt(n,12)',scale=320:-1,tile=12x1" -frames:v 1 "$O/first-frames.png"
echo "$O"
