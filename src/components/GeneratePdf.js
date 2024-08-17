import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import { IMG_URL } from '../utils/ApiEndPoints.js';
import { Api_Url } from '../utils/ApiEndPoints.js';
import axios from 'axios';

const GeneratePdf = (props) => {
    const { questions } = props;
    const MAX_PAGE_HEIGHT = 250; // Maximum height of content on a page
    const [branding, setBranding] = useState({});
    const combinedTopics = [];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(Api_Url + `getbranding`);
            console.log(response.data.res[0]);
            setBranding(response.data.res[0]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    console.log('data questions', questions);
    const handleDownloadPDF = async () => {
        try {
            const doc = new jsPDF();
            doc.setFont('Times');
            doc.setFontSize(14);
            let currentPageHeight = 0;
            const headerText = branding.header_text; // Header text
            const footerText = branding.footer_text; // Footer text

            questions.forEach((question) => {
                combinedTopics.push(question.topic_field.trim());
            });

            const uniqueFields = [...new Set(combinedTopics)];

            // Output the unique fields
            console.log('Output the unique fields', uniqueFields);

            const tableData = [
                { label: 'Grade Level', value: '6' },
                { label: 'Subject', value: combinedTopics.join(',') },
                { label: 'Difficulty Level', value: 'Hard' },
                { label: 'Time', value: '40 mins' },
            ];

            const addHeaderAndFooter = () => {
                const totalPages = doc.internal.getNumberOfPages();
                for (let i = 1; i <= totalPages; i++) {
                    doc.setPage(i);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    // Add header on the left side
                    doc.setFont('Times-Bold');
                    doc.setFontSize(15);
                    doc.setTextColor(100, 100, 100);
                    doc.text(headerText, pageWidth - 10, 10, { align: 'right' });
                    // Add footer on the right side
                    doc.setFontSize(10);
                    doc.setTextColor(100, 100, 100);
                    doc.text(footerText, pageWidth - 10, pageHeight - 10, { align: 'right' });
                }
            };

            const addDetailsTable = () => {
                const startY = 30; // Start Y position for the table
                const rowHeight = 10; // Height of each row
                const col1Width = 40; // Width of the first column
                const col2Width = 70; // Width of the second column

                tableData.forEach((rowData, index) => {
                    const { label, value } = rowData;
                    const xPos = 10; // X position for the first column
                    const yPos = startY + index * rowHeight; // Y position for each row
                    doc.text(label, xPos, yPos);
                    doc.text(value, xPos + col1Width, yPos);
                });

                doc.addPage(); // Add a new page after the table data
            };


            addDetailsTable();

            for (let index = 0; index < questions.length; index++) {
                const { question: questionImages, question_type, question, year } = questions[index];
                const questionImageNames = questionImages.split(',');
                const textXPos = 10;
                let textYPos = 6 + index * 90; // Adjust the position as needed
                if (textYPos + currentPageHeight > MAX_PAGE_HEIGHT) {
                    doc.addPage();
                    currentPageHeight = 0;
                    textYPos = 25; // Reset textYPos for the new page
                }
                
                let questionLabel = `Q - ${index + 1}`;
                if (year) {
                    questionLabel += ` (${year})`;
                }
                doc.text(questionLabel, textXPos, textYPos);

                if (question_type === 'Text') {
                    
                    const lines = doc.splitTextToSize(question, doc.internal.pageSize.getWidth() - 20);
                    // eslint-disable-next-line no-loop-func
                    lines.forEach((line, i) => {
                        if (textYPos + currentPageHeight + 10 > MAX_PAGE_HEIGHT) {
                            doc.addPage();
                            currentPageHeight = 0;
                            textYPos = 5;
                        }

                        doc.text(line, textXPos, textYPos + 10 + i * 10);
                    });
                    currentPageHeight += lines.length * 5; // Adjust based on the height of the text
                }

                if (question_type === 'Image') {
                    
                    for (let i = 0; i < questionImageNames.length; i++) {
                        const imageName = questionImageNames[i].trim();
                        const imgData = IMG_URL + imageName;
                        const imageXPos = 10;
                        let imageYPos = 10 + currentPageHeight;
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const pageHeight = doc.internal.pageSize.getHeight();
                        const imageWidth = pageWidth * 0.9;
                        const imageHeight = pageHeight * 0.4;
                        if (imageYPos + imageHeight > MAX_PAGE_HEIGHT) {
                            doc.addPage();
                            currentPageHeight = 0;
                            imageYPos = 10;
                        }
                        doc.addImage(imgData, 'JPEG', imageXPos, imageYPos, imageWidth, imageHeight);
                        currentPageHeight += imageHeight + 2;
                    }
                }
            }
            console.log('Finished processing questions');
            addHeaderAndFooter();
            /*    doc.save('questions.pdf'); */
            const pdfData = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfData);
            window.open(pdfUrl, '_blank');

        } catch (error) {
            console.error('Error during PDF generation:', error);
        }
    };

    return (
        <div onClick={handleDownloadPDF}>
            <small className="p-2">Pdf⬇️</small>
        </div>
    );
};

export default GeneratePdf;
