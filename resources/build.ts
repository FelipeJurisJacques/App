import * as fs from 'fs';
import * as path from 'path';

/**
 * Pre-compiler script to generate dynamic CSS assets.
 */

function generateMainBackgroundCSS() {
    const points: string[] = [];
    const positions = [
        '50% -',
        '50% +',
    ];

    // Initialize path starting point
    points.push(`0px 0px`);

    for (let i = 0; i < 20; i++) {
        let size = Math.round(1 * (i * 0.3 + 1));
        for (let position of positions) {
            points.push(`calc(${position} ${i * 10 + size + 70}px) 0px`);
            points.push(`calc(${position} ${i * 10 + size + 70 + size}px) 0px`);
            points.push(`calc(${position} ${i * 10 + size + 60 + size}px) 30px`);
            points.push(`calc(${position} ${i * 10 + size + 60}px) 30px`);
            points.push(`calc(${position} ${i * 10 + size + 70}px) 0px`);
        }
    }

    // Close path with finishing point
    points.push(`0px 0px`);

    const clipPathValue = `polygon(${points.join(', ')})`;
    const cssContent = `div.bacground {
    clip-path: ${clipPathValue};
}
`;

    // Target directory (using absolute path as requested by User)
    // Note: /workspace is the root in the container.
    const outputDir = '/workspace/stylesheets';
    const outputPath = path.join(outputDir, 'main-background.css');

    try {
        // Create directory if it doesn't exist
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        // Write the CSS file
        fs.writeFileSync(outputPath, cssContent, 'utf-8');
        console.log(`Successfully generated: ${outputPath}`);
    } catch (error) {
        console.error(`Error generating CSS: ${error}`);
        process.exit(1);
    }
}

// Run the generator
generateMainBackgroundCSS();
