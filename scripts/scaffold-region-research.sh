#!/bin/bash
# Regional Research Folder Scaffolding Script
# Creates standard folder structure for PMF/competitive analysis for any region
# Usage: ./scripts/scaffold-region-research.sh [REGION]
# Example: ./scripts/scaffold-region-research.sh France

set -e

if [ -z "$1" ]; then
  echo "Error: Region name required"
  echo "Usage: ./scripts/scaffold-region-research.sh [REGION]"
  echo "Example: ./scripts/scaffold-region-research.sh France"
  exit 1
fi

REGION="$1"
BASE_DIR="research/${REGION}"

echo "Creating regional research folder structure for: ${REGION}"
echo "Base directory: ${BASE_DIR}"

# Create all standard folders
mkdir -p "${BASE_DIR}/customer-transcripts"
mkdir -p "${BASE_DIR}/internal-sme-transcripts"
mkdir -p "${BASE_DIR}/brainstorm-sessions"
mkdir -p "${BASE_DIR}/brainstorm-analysis"
mkdir -p "${BASE_DIR}/gap-data"
mkdir -p "${BASE_DIR}/gap-analysis"
mkdir -p "${BASE_DIR}/thematic-analysis"
mkdir -p "${BASE_DIR}/raw-data"

# Create .gitkeep files to preserve empty folders in git
touch "${BASE_DIR}/customer-transcripts/.gitkeep"
touch "${BASE_DIR}/internal-sme-transcripts/.gitkeep"
touch "${BASE_DIR}/brainstorm-sessions/.gitkeep"
touch "${BASE_DIR}/brainstorm-analysis/.gitkeep"
touch "${BASE_DIR}/gap-data/.gitkeep"
touch "${BASE_DIR}/gap-analysis/.gitkeep"
touch "${BASE_DIR}/thematic-analysis/.gitkeep"
touch "${BASE_DIR}/raw-data/.gitkeep"

echo ""
echo "✅ Regional research folders created successfully for ${REGION}"
echo ""
echo "Folder structure:"
echo "  ${BASE_DIR}/"
echo "  ├── customer-transcripts/     (105: customer interview transcripts)"
echo "  ├── internal-sme-transcripts/ (105: internal SME transcripts)"
echo "  ├── brainstorm-sessions/      (106: internal brainstorm data sources)"
echo "  ├── brainstorm-analysis/      (106: synthesis output)"
echo "  ├── gap-data/                 (108: presales gap exports)"
echo "  ├── gap-analysis/             (108: gap analysis output)"
echo "  ├── thematic-analysis/        (120: PMF analysis reports)"
echo "  └── raw-data/                 (General: raw research data)"
echo ""
echo "Ready for Regional E2E pipeline: Run ${REGION} e2e"
