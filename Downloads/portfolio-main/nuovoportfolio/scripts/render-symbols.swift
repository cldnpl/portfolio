// Renders SF Symbols to white-on-transparent PNGs for the service tiles.
//   swift scripts/render-symbols.swift <out-dir>
import AppKit

let out = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "."
let symbols = ["swift", "visionpro", "visionpro.fill", "brain.head.profile"]
let canvas: CGFloat = 2048

for name in symbols {
    let config = NSImage.SymbolConfiguration(pointSize: 1120, weight: .semibold)
    guard let symbol = NSImage(systemSymbolName: name, accessibilityDescription: nil)?
        .withSymbolConfiguration(config) else {
        print("missing \(name)"); continue
    }
    let rep = NSBitmapImageRep(bitmapDataPlanes: nil, pixelsWide: Int(canvas), pixelsHigh: Int(canvas),
                               bitsPerSample: 8, samplesPerPixel: 4, hasAlpha: true, isPlanar: false,
                               colorSpaceName: .deviceRGB, bytesPerRow: 0, bitsPerPixel: 0)!
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
    let size = symbol.size
    let scale = min(canvas * 0.8 / size.width, canvas * 0.8 / size.height)
    let w = size.width * scale, h = size.height * scale
    let rect = NSRect(x: (canvas - w) / 2, y: (canvas - h) / 2, width: w, height: h)
    // tint the template symbol white
    let tinted = NSImage(size: size, flipped: false) { r in
        symbol.draw(in: r)
        NSColor.white.set()
        r.fill(using: .sourceAtop)
        return true
    }
    tinted.draw(in: rect)
    NSGraphicsContext.restoreGraphicsState()
    let data = rep.representation(using: .png, properties: [:])!
    try! data.write(to: URL(fileURLWithPath: "\(out)/\(name).png"))
    print("\(name) \(Int(w))x\(Int(h))")
}
