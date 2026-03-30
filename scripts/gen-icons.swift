import AppKit

func generateIcon(size: Int, path: String) {
    let s = CGFloat(size)
    let image = NSImage(size: NSSize(width: s, height: s))
    image.lockFocus()

    let ctx = NSGraphicsContext.current!.cgContext

    // Rounded rect clip
    let radius = s * 0.22
    let path2 = NSBezierPath(roundedRect: NSRect(x: 0, y: 0, width: s, height: s), xRadius: radius, yRadius: radius)
    path2.addClip()

    // Gradient background
    let colorSpace = CGColorSpaceCreateDeviceRGB()
    let colors = [
        CGColor(red: 1.0, green: 0.973, blue: 0.941, alpha: 1.0),   // #FFF8F0
        CGColor(red: 1.0, green: 0.91, blue: 0.84, alpha: 1.0)      // #FFE8D6
    ]
    let gradient = CGGradient(colorsSpace: colorSpace, colors: colors as CFArray, locations: [0.0, 1.0])!
    ctx.drawLinearGradient(gradient, start: CGPoint(x: 0, y: s), end: CGPoint(x: s, y: 0), options: [])

    // Decorative circles
    let c1 = NSColor(red: 0.91, green: 0.573, blue: 0.486, alpha: 0.15) // terracotta
    c1.setFill()
    NSBezierPath(ovalIn: NSRect(x: s * 0.62, y: s * 0.62, width: s * 0.25, height: s * 0.25)).fill()

    let c2 = NSColor(red: 0.482, green: 0.686, blue: 0.824, alpha: 0.12) // sky
    c2.setFill()
    NSBezierPath(ovalIn: NSRect(x: s * 0.08, y: s * 0.08, width: s * 0.18, height: s * 0.18)).fill()

    // Draw emoji
    let emojiSize = s * 0.55
    let attrs: [NSAttributedString.Key: Any] = [
        .font: NSFont.systemFont(ofSize: emojiSize)
    ]
    let str = NSAttributedString(string: "🎨", attributes: attrs)
    let strSize = str.size()
    let x = (s - strSize.width) / 2
    let y = (s - strSize.height) / 2
    str.draw(at: NSPoint(x: x, y: y))

    image.unlockFocus()

    // Save as PNG
    guard let tiff = image.tiffRepresentation,
          let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:])
    else { return }
    try! png.write(to: URL(fileURLWithPath: path))
    print("Generated \(path)")
}

generateIcon(size: 512, path: "public/icons/icon-512.png")
generateIcon(size: 192, path: "public/icons/icon-192.png")
