import React, { useState, useEffect } from 'react';
import { Document, Packer, Paragraph, HeadingLevel, ImageRun, Header, Footer, AlignmentType, TextRun } from "docx";
import Modal from 'react-modal';
import axios from 'axios';
import { Api_Url } from '../utils/ApiEndPoints.js';

Modal.setAppElement('#root'); // Make sure to set this for accessibility

const GenerateWord = (props) => {
    const { questions } = props;
    const IMG_URL = "http://localhost:4000/uploads/";
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState('');
    const [branding, setBranding] = useState({ header_text: 'Header Text', footer_text: 'Footer Text' }); // Initialize branding state with default values

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(Api_Url + `getbranding`);
            console.log("branding--", response?.data?.res[0]);
            setBranding(response?.data?.res[0] || { header_text: 'Header Text', footer_text: 'Footer Text' }); // Fallback to default values if response is empty
        } catch (error) {
            console.error('Error fetching branding data:', error);
        }
    };

    const fetchImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsArrayBuffer(blob);
        });
    };

    const generatePreviewContent = async () => {
        console.log("wordData - prewiew", questions);
        console.log("branding after setting field. prewiew", branding);
        const sectionsPromises = questions.map(async (item, index) => {
            let questionContent = [];

            if (item.question_type === "Image") {
                const questionImagesPromises = item.question.split(',').map(async (imageName) => {
                    const imageData = await fetchImage(`${IMG_URL}${imageName}`);
                    return `<p><img src="${URL.createObjectURL(new Blob([imageData]))}" width="400" height="300" /></p>`;
                });

                questionContent = await Promise.all(questionImagesPromises);
            } else {
                questionContent = [
                    `<p>${item.question}</p>`
                ];
            }

            const yearText = item.year ? ` (${item.year})` : '';
            return `
                <h1>Q-${index + 1}${yearText}</h1>
                ${questionContent.join('')}
                <br/> <!-- Add space between questions -->
            `;
        });
        const sections = await Promise.all(sectionsPromises);
        setPreviewContent(sections.join(''));
        setIsPreviewOpen(true);
    };
    const generateDocument = async () => {
        try {
            console.log("wordData", questions);
            console.log("branding after setting field.", branding);
    
            // Process the header and footer text, handling any newline characters
            const headerText = branding.header_text || "Default Header Text";
            const footerTextLines = (branding.footer_text || "Default Footer Text").split('\n');
    
            // Define the header using the branding text
            const header = new Header({
                children: [
                    new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                            new TextRun({
                                text: headerText,
                                bold: true,
                                size: 20,
                            }),
                        ],
                    }),
                ],
            });
    
            // Define the footer using the branding text, handling multiple lines if necessary
            const footer = new Footer({
                children: footerTextLines.map(line => new Paragraph({
                    alignment: AlignmentType.RIGHT,
                    children: [
                        new TextRun({
                            text: line,
                            size: 16,
                        }),
                    ],
                })),
            });
    
            // First page with labels
            const firstPageSection = {
                properties: {
                    header: header,
                    footer: footer,
                },
                children: [
                    new Paragraph({
                        text: `Grade Level: ${questions[0]?.grade || 'N/A'}`,
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `Subject: ${questions[0]?.subject_field || 'N/A'}`,
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `Difficulty Level: ${questions[0]?.difficulty_level || 'N/A'}`,
                        heading: HeadingLevel.HEADING_1,
                    }),
                    new Paragraph({
                        text: `Time: 30 mins`,
                        heading: HeadingLevel.HEADING_1,
                    }),
                ],
            };
    
            // Remaining pages with questions
            const sectionsPromises = questions.map(async (item, index) => {
                let questionContent = [];
                if (item.question_type === "Image") {
                    const questionImagesPromises = item.question.split(',').map(async (imageName) => {
                        const imageData = await fetchImage(`${IMG_URL}${imageName}`);
                        return new Paragraph({
                            children: [
                                new ImageRun({
                                    data: imageData,
                                    transformation: {
                                        width: 400,
                                        height: 300,
                                    },
                                }),
                            ],
                            indent: { left: 720 }, // Indentation for images
                            spacing: { after: 200 }, // Spacing after images
                        });
                    });
    
                    questionContent = await Promise.all(questionImagesPromises);
                } else {
                    questionContent = [
                        new Paragraph({
                            text: item.question,
                            indent: { left: 720 }, // Indentation for text
                        }),
                    ];
                }
    
                const yearText = item.year ? ` (${item.year})` : '';
                return {
                    children: [
                        new Paragraph({
                            text: `Q-${index + 1}${yearText}`,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 200 }, // Spacing after the question number
                        }),
                        ...questionContent,
                        new Paragraph({ text: "" }), // Empty paragraph for spacing
                    ],
                };
            });
    
            const questionSections = await Promise.all(sectionsPromises);
    
            // Combine first page and question sections without unnecessary section breaks
            const doc = new Document({
                sections: [
                    firstPageSection,
                    {
                        properties: {
                            header: header,
                            footer: footer,
                        },
                        children: questionSections.flatMap(section => section.children),
                    },
                ],
                creator: 'Your Name',
            });
    
            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = questions[0]?.subject_field ;
            link.click();
        } catch (error) {
            console.error('Error generating document:', error);
        }
    };
    
    
    
    

    return (
        <div>
            <div onClick={generatePreviewContent}>
                <small className="p-2">Word⬇️</small>
            </div>
            <Modal
                isOpen={isPreviewOpen}
                onRequestClose={() => setIsPreviewOpen(false)}
                contentLabel="Preview Document"
            >
                <div dangerouslySetInnerHTML={{ __html: previewContent }} />
                <button class="bg-cyan-500 text-white rounded-lg w-44" onClick={() => {
                    setIsPreviewOpen(false);
                    generateDocument();
                }}>Download</button>
                <button class="bg-red-400 px-4 m-4 text-white rounded-lg " onClick={() => setIsPreviewOpen(false)}> Close</button>
            </Modal>
        </div>
    );
};

export default GenerateWord;
