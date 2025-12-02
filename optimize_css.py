import re

# Read the original CSS file
with open('style.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Remove lines 5-24 (duplicate font import and early .topbar/nav definitions)
lines = css_content.split('\n')

# Keep line 1-4, skip 5-24, keep rest
optimized_lines = lines[:4] + lines[24:]

# Join back
optimized_css = '\n'.join(optimized_lines)

# Write optimized version
with open('style.css', 'w', encoding='utf-8') as f:
    f.write(optimized_css)

print(f"Original size: {len(css_content)} bytes")
print(f"Optimized size: {len(optimized_css)} bytes")
print(f"Saved: {len(css_content) - len(optimized_css)} bytes")
print(f"Lines removed: 20")
