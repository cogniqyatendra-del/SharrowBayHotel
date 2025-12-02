# Read the CSS file
$content = Get-Content 'style.css.backup' -Raw
$lines = $content -split "`n"

# Remove lines 5-24 (indices 4-23 in zero-based array)
# Keep lines 1-4 (indices 0-3) and lines 25+ (indices 24+)
$optimized = ($lines[0..3] + $lines[24..($lines.Length-1)]) -join "`n"

# Write optimized version
Set-Content 'style.css' -Value $optimized -NoNewline

# Show results
$originalSize = (Get-Item 'style.css.backup').Length
$newSize = (Get-Item 'style.css').Length
Write-Host "Original: $originalSize bytes"
Write-Host "Optimized: $newSize bytes"  
Write-Host "Saved: $($originalSize - $newSize) bytes ($(([math]::Round((($originalSize - $newSize) / $originalSize) * 100, 2)))%)"
