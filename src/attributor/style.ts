import Attributor from './attributor';

function camelize(name: string): string {
  const parts = name.split('-');
  const rest = parts
    .slice(1)
    .map(function (part: string) {
      return part[0].toUpperCase() + part.slice(1);
    })
    .join('');
  return parts[0] + rest;
}

class StyleAttributor extends Attributor {
  static keys(node: Element): string[] {
    return (node.getAttribute('style') || '').split(';').map(function (value) {
      const arr = value.split(':');
      return arr[0].trim();
    });
  }

  add(node: HTMLElement, value: string): boolean {
    if (!this.canAdd(node, value)) return false;
    const key = camelize(this.keyName);
    (node.style as any)[key] = value;
    return true;
  }

  remove(node: HTMLElement): void {
    const key = camelize(this.keyName);
    (node.style as any)[key] = '';
    if (!node.getAttribute('style')) {
      node.removeAttribute('style');
    }
  }

  value(node: HTMLElement): string {
    const key = camelize(this.keyName);
    const value = (node.style as any)[key];
    return this.canAdd(node, value) ? value : '';
  }
}

export default StyleAttributor;
