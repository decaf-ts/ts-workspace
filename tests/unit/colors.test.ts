import {
  BrightBackgroundColors,
  BrightForegroundColors,
  color,
  ColorizeOptions, StandardBackgroundColors,
  StandardForegroundColors,
  styles,
} from "../../src/bin/utils/colors";  // Adjust the import path as necessary

describe('color function', () => {
  const testText = 'Hello World!';

  // Helper function to log colored text
  const logColored = (description: string, coloredText: string) => {
    console.log(`\n${description}: ${coloredText}`);
  };

  it('shows basic colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'].forEach(color => {
      expect(typeof colored[color as keyof ColorizeOptions]).toBe('string');
      logColored(`${color} text`, colored[color as keyof ColorizeOptions] as string);
    });
  });

  it('shows bright foreground bright colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'].forEach(color => {
      const brightColor = color as keyof typeof colored;
      expect(typeof colored[brightColor]).toBe('string');
      logColored(`bright ${color} text`, colored[brightColor] as string);
    });
  });

  it('shows background colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'].forEach(color => {
      const bgColor = `bg${color}` as keyof typeof colored;
      expect(typeof colored[bgColor]).toBe('string');
      logColored(`${color} background`, colored[bgColor] as string);
    });
  });

  it('shows bright background colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    ['Black', 'Red', 'Green', 'Yellow', 'Blue', 'Magenta', 'Cyan', 'White'].forEach(color => {
      const bgBrightColor = `bgBright${color}` as keyof typeof colored;
      expect(typeof colored[bgBrightColor]).toBe('string');
      logColored(`bright ${color} background`, colored[bgBrightColor] as string);
    });
  });

  it('applies styles', () => {
    const colored: ColorizeOptions = color(testText);
    
    ['reset', 'bold', 'dim', 'italic', 'underline', 'blink', 'inverse', 'hidden', 'strikethrough'].forEach(style => {
      expect(typeof colored[style as keyof ColorizeOptions]).toBe('string');
      logColored(`${style} style`, colored[style as keyof ColorizeOptions] as string);
    });
  });

  it('256 colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    expect(typeof colored.color256(100)).toBe('string');
    logColored('256 color (100)', colored.color256(100));

    expect(typeof colored.bgColor256(200)).toBe('string');
    logColored('256 background color (200)', colored.bgColor256(200));
  });

  it('RGB colors', () => {
    const colored: ColorizeOptions = color(testText);
    
    expect(typeof colored.rgb(255, 100, 50)).toBe('string');
    logColored('RGB color (255, 100, 50)', colored.rgb(255, 100, 50));

    expect(typeof colored.bgRgb(50, 100, 255)).toBe('string');
    logColored('RGB background color (50, 100, 255)', colored.bgRgb(50, 100, 255));
  });

  it('Should handle multiple arguments passed to color function', () => {
    const colored = color('Hello', 'World', '!');

    expect(colored.red).toBe('\x1b[31mHello World !\x1b[0m');
    expect(colored.bgBlue).toBe('\x1b[44mHello World !\x1b[0m');
    expect(colored.bold).toBe('\x1b[1mHello World !\x1b[0m');

    expect(colored.color256(100)).toBe('\x1b[38;5;100mHello World !\x1b[0m');
    expect(colored.bgColor256(200)).toBe('\x1b[48;5;200mHello World !\x1b[0m');

    expect(colored.rgb(255, 100, 50)).toBe('\x1b[38;2;255;100;50mHello World !\x1b[0m');
    expect(colored.bgRgb(50, 100, 255)).toBe('\x1b[48;2;50;100;255mHello World !\x1b[0m');
  });

  it('Should check if the foreground method works correctly with custom color codes', () => {
    const colored = color('Test');
    const customColorCode = 94; // Bright blue

    expect(colored.foreground(customColorCode)).toBe(`\x1b[${customColorCode}mTest\x1b[0m`);
  });

  it('Should test the background method with custom color codes', () => {
    const colored = color('Test');
    const customColorCode = 45; // Magenta background

    expect(colored.background(customColorCode)).toBe(`\x1b[45mTest\x1b[0m`);
  });

  it('Should verify that the style method works with custom style codes', () => {
    const colored = color('Test');
    const customStyleCode = 'bold';

    expect(colored.style(customStyleCode)).toBe(`\x1b[${styles[customStyleCode]}mTest\x1b[0m`);
    expect(colored.bold).toBe(`\x1b[${styles.bold}mTest\x1b[0m`);
  });

  it('Should handle invalid color codes gracefully in color256 and bgColor256 methods', () => {
    const colored = color('Test');

    // Test color256 with invalid values
    expect(colored.color256(-1)).toBe('Test');
    expect(colored.color256(256)).toBe('Test');
    expect(colored.color256(NaN)).toBe('Test');

    // Test bgColor256 with invalid values
    expect(colored.bgColor256(-1)).toBe('Test');
    expect(colored.bgColor256(256)).toBe('Test');
    expect(colored.bgColor256(NaN)).toBe('Test');

    // Test with valid values to ensure normal functionality
    expect(colored.color256(100)).toMatch(/\x1b\[38;5;100m.*\x1b\[0m/);
    expect(colored.bgColor256(200)).toMatch(/\x1b\[48;5;200m.*\x1b\[0m/);
  });

  it('Should test RGB color methods with boundary values (0 and 255)', () => {
    const colored = color('Test');

    // Test rgb method with boundary values
    expect(colored.rgb(0, 0, 0)).toBe('\x1b[38;2;0;0;0mTest\x1b[0m');
    expect(colored.rgb(255, 255, 255)).toBe('\x1b[38;2;255;255;255mTest\x1b[0m');
    expect(colored.rgb(0, 255, 0)).toBe('\x1b[38;2;0;255;0mTest\x1b[0m');

    // Test bgRgb method with boundary values
    expect(colored.bgRgb(0, 0, 0)).toBe('\x1b[48;2;0;0;0mTest\x1b[0m');
    expect(colored.bgRgb(255, 255, 255)).toBe('\x1b[48;2;255;255;255mTest\x1b[0m');
    expect(colored.bgRgb(255, 0, 255)).toBe('\x1b[48;2;255;0;255mTest\x1b[0m');

    // Test rgb and bgRgb methods with invalid values
    expect(colored.rgb(-1, 0, 0)).toBe('Test');
    expect(colored.rgb(0, 256, 0)).toBe('Test');
    expect(colored.rgb(0, 0, NaN)).toBe('Test');
    expect(colored.bgRgb(-1, 0, 0)).toBe('Test');
    expect(colored.bgRgb(0, 256, 0)).toBe('Test');
    expect(colored.bgRgb(0, 0, NaN)).toBe('Test');
  });

  const lineBreak = 32;

  it(`Should create a string with 256 ANSI color backgrounds and foregrounds, with line breaks every ${lineBreak} characters`, () => {
    const col = color('$');

    let result = '';
  
    for (let i = 0; i < 256; i++) {
      const bgColor = i;
      const fgColor = 255 - i;
      result += color(col.color256(fgColor)).bgColor256(bgColor);
      
      // Add a line break every 36 characters
      if ((i + 1) % lineBreak === 0) {
        result += '\n';
      }
    }
  
    console.log('256 ANSI color spectrum:');
    console.log(result);
  

    // Test the first color combination
    expect(result).toMatch(/^\x1b\[48;5;0m\x1b\[38;5;255m\$/);


    // Test that there are the correct number of line breaks
    expect(result.split('\n').length).toBe(256/ lineBreak); // 256 / 24 = 10.66, rounded up to 11

    // Test that the result string contains the correct number of color codes
    expect(result.match(/\x1b\[/g)?.length).toBe(256 * 3); // 256 bg colors, 256 fg colors, 256 resets
  });

  it(`Should create a string with RGB color combinations, with line breaks every ${lineBreak} characters`, () => {
    const step = lineBreak;
    const cellWidth = 2;
    const cellsPerLine = lineBreak;
    let result = '';
    let count = 0;

    for (let r = 0; r <= 255; r += step) {
      for (let g = 0; g <= 255; g += step) {
        for (let b = 0; b <= 255; b += step) {
          const colored = color(new Array(cellWidth).fill(' ').join(''));
          result += colored.bgRgb(r, g, b);
          count++;

          if (count % cellsPerLine === 0) {
            result += '\n';
          }
        }
      }
    }

    console.log('RGB color spectrum:');
    console.log(result);

    const expectedCombinations = Math.pow(256 / step, 3);
    // Test the first color combination (black)
    expect(result).toMatch(/^\x1b\[48;2;0;0;0m  /);

    // Test the last color combination (white)
    expect(result).toMatch(/\x1b\[48;2;224;224;224m  (\n|)\x1b\[0m$/);

    // Test that there are the correct number of line breaks
    const expectedLines = Math.ceil(expectedCombinations / cellsPerLine);
    expect(result.split('\n').length).toBe(expectedLines);

    // Test that the result string contains the correct number of color codes
    expect(result.match(/\x1b\[/g)?.length).toBe(expectedCombinations * 2); // Each combination has a color code and a reset

    console.log(`Total RGB combinations: ${expectedCombinations}`);
    console.log(`Total lines: ${expectedLines}`);
  });
});
