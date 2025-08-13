#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function convertConversationToMarkdown(jsonFilePath) {
    try {
        // Read and parse the JSON file
        const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
        const conversation = JSON.parse(jsonContent);
        
        // Extract basic info
        const title = conversation.name || 'Conversation';
        const createdAt = new Date(conversation.createdAt);
        const tokenCount = conversation.tokenCount || 0;
        
        // Start building markdown
        let markdown = `# ${title}\n\n`;
        markdown += `**Created:** ${createdAt.toLocaleString()}\n`;
        markdown += `**Token Count:** ${tokenCount.toLocaleString()}\n\n`;
        
        if (conversation.systemPrompt) {
            markdown += `## System Prompt\n\n${conversation.systemPrompt}\n\n`;
        }
        
        markdown += `---\n\n`;
        
        // Process messages
        conversation.messages.forEach((message, index) => {
            const version = message.versions[message.currentlySelected];
            
            if (version.role === 'user') {
                markdown += `## User\n\n`;
                version.content.forEach(content => {
                    if (content.type === 'text') {
                        markdown += `${content.text}\n\n`;
                    }
                });
            } else if (version.role === 'assistant') {
                markdown += `## Assistant\n\n`;
                
                if (version.type === 'multiStep') {
                    version.steps.forEach(step => {
                        if (step.type === 'contentBlock') {
                            step.content.forEach(content => {
                                if (content.type === 'text' && !content.isStructural) {
                                    // Handle thinking blocks
                                    if (step.style && step.style.type === 'thinking') {
                                        markdown += `*${step.style.title}*\n\n`;
                                        markdown += `> ${content.text}\n\n`;
                                    } else {
                                        markdown += `${content.text}\n\n`;
                                    }
                                }
                            });
                        }
                    });
                } else {
                    // Single step response
                    version.content.forEach(content => {
                        if (content.type === 'text') {
                            markdown += `${content.text}\n\n`;
                        }
                    });
                }
            }
            
            // Add separator between messages (except last)
            if (index < conversation.messages.length - 1) {
                markdown += `---\n\n`;
            }
        });
        
        return markdown;
    } catch (error) {
        console.error('Error converting conversation:', error.message);
        return null;
    }
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node convert-conversation.js <conversation.json>');
        console.log('Example: node convert-conversation.js conversation.json');
        process.exit(1);
    }
    
    const inputFile = args[0];
    
    if (!fs.existsSync(inputFile)) {
        console.error(`File not found: ${inputFile}`);
        process.exit(1);
    }
    
    console.log(`Converting ${inputFile}...`);
    
    const markdown = convertConversationToMarkdown(inputFile);
    
    if (markdown) {
        // Generate output filename
        const baseName = path.basename(inputFile).replace(/\.(conversation\.)?json$/, '');
        const outputFile = `${baseName}.md`;
        
        // Write markdown file
        fs.writeFileSync(outputFile, markdown, 'utf8');
        console.log(`✅ Converted to ${outputFile}`);
        console.log(`📄 ${markdown.split('\n').length} lines generated`);
    } else {
        console.error('❌ Conversion failed');
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { convertConversationToMarkdown };