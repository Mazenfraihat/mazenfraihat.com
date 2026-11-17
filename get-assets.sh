#!/usr/bin/env bash
# Pulls your images + resume from the CURRENT live site (Replit) into this repo.
# Run this ONCE from the repo folder BEFORE you cancel Replit:
#   bash get-assets.sh
set -e
BASE="https://mazenfraihat.com"
mkdir -p assets/img

dl() { echo "→ $2"; curl -fsSL "$BASE/$1" -o "$2"; }

dl "assets/Untitled_design_2_1783530615635-DfbmpUxb.PNG"                              assets/img/profile.png
dl "assets/Screenshot_2026-09-11_at_3.11.34_PM_1789164697023-DEs16Icl.png"            assets/img/roboilm.png
dl "assets/data_automation_workflow_visualization-BG6XBX9o.png"                       assets/img/data-automation.png
dl "assets/Screenshot_2025-12-27_at_7.13.56_PM_1766852100748-BHYDs_Yp.png"            assets/img/linear-regression.png
dl "assets/Screenshot_2025-12-27_at_7.01.17_PM_1766851561710-5YB2fTpO.png"            assets/img/automata.png
dl "assets/download_1766852591284-DZr8yDcL.jpeg"                                      assets/img/cpp.jpeg
dl "assets/64a84c6166dfb53356d87bee_ChaffeyCollege_900sq_1766852989729-C5cP7KcG.png"  assets/img/chaffey.png
dl "Mazen_Fraihat_Resume.pdf"                                                          Mazen_Fraihat_Resume.pdf

echo "✓ Done. $(ls assets/img | wc -l | tr -d ' ') images + resume downloaded."
