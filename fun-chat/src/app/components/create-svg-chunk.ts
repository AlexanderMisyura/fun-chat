export function createSvgChunk(svgChunk: SpriteSymbol, classes: string[]): SVGElement {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add(...classes);
  svg.setAttribute('viewBox', svgChunk.viewBox);

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `#${svgChunk.id}`);
  svg.append(use);

  return svg;
}
