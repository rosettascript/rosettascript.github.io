#!/bin/bash
# Build script for Random Universe Cipher WASM module

set -e

echo "🔧 Building WASM module..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack not found!"
    echo "Install it with: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
    exit 1
fi

# Build for web target with release optimizations
wasm-pack build --target web --release --out-dir pkg

echo "✅ WASM module built successfully!"
echo "📦 Output in: wasm/pkg/"
echo ""
echo "Next steps:"
echo "1. Copy pkg contents to src/lib/random-universe-cipher/wasm/"
echo "2. Update JavaScript integration in modes-fast.ts"
echo "3. Test with: npm run dev"

