#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { convertConversationToMarkdown } = require('./convert-conversation');

function findConversationFiles(directory) {
    const files = [];
    
    function scanDirectory(dir) {
        const items = fs.readdirSync(dir);
        
        for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory()) {
                scanDirectory(fullPath);
            } else if (item.endsWith('.json') && (item.includes('conversation') || item.includes('chat'))) {
                files.push(fullPath);
            }
        }
    }
    
    scanDirectory(directory);
    return files;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node batch-convert.js <directory>');
        console.log('Example: node batch-convert.js ./conversations');
        console.log('');
        console.log('This will find all JSON conversation files in the directory and convert them to markdown.');
        process.exit(1);
    }
    
    const directory = args[0];
    
    if (!fs.existsSync(directory)) {
        console.error(`Directory not found: ${directory}`);
        process.exit(1);
    }
    
    if (!fs.statSync(directory).isDirectory()) {
        console.error(`Not a directory: ${directory}`);
        process.exit(1);
    }
    
    console.log(`🔍 Scanning ${directory} for conversation files...`);
    
    const conversationFiles = findConversationFiles(directory);
    
    if (conversationFiles.length === 0) {
        console.log('❌ No JSON conversation files found');
        process.exit(0);
    }
    
    console.log(`📁 Found ${conversationFiles.length} conversation file(s)`);
    console.log('');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const filePath of conversationFiles) {
        const relativePath = path.relative(process.cwd(), filePath);
        console.log(`Converting ${relativePath}...`);
        
        try {
            const markdown = convertConversationToMarkdown(filePath);
            
            if (markdown) {
                const baseName = path.basename(filePath).replace(/\.(conversation\.)?json$/, '');
                const outputDir = path.dirname(filePath);
                const outputFile = path.join(outputDir, `${baseName}.md`);
                
                fs.writeFileSync(outputFile, markdown, 'utf8');
                console.log(`  ✅ → ${path.relative(process.cwd(), outputFile)}`);
                successCount++;
            } else {
                console.log(`  ❌ Conversion failed`);
                errorCount++;
            }
        } catch (error) {
            console.log(`  ❌ Error: ${error.message}`);
            errorCount++;
        }
        
        console.log('');
    }
    
    console.log('📊 Summary:');
    console.log(`  ✅ Successfully converted: ${successCount}`);
    console.log(`  ❌ Failed: ${errorCount}`);
    console.log(`  📄 Total processed: ${conversationFiles.length}`);
}

if (require.main === module) {
    main();
}