function extractStudentData($cell) {
    const $link = $cell.find("a").first();
    const $img = $link.find("img.userpicture").first();
    const $spanImg = $link.find("span[role='img']").first();

    const cellText = $cell.text().trim().replace(/\s+/g, " ");
    const href = $link.attr("href");
    const idMatch = href ? href.match(/id=(\d+)/) : null;
    const extractedId = idMatch ? idMatch[1] : "";

    let studentCover = null;
    let linkType = "simple"; // default

    if ($img.length > 0) {
        const imgSrc = $img.attr("src");
        if (imgSrc) {
            if (imgSrc.startsWith("/")) {
                studentCover = this.baseUrl + imgSrc;
            } else if (imgSrc.startsWith("http")) {
                studentCover = imgSrc;
            } else {
                studentCover = this.baseUrl + "/" + imgSrc;
            }
        }
        linkType = "image";
    } else if ($spanImg.length > 0) {
        linkType = "image";
    }

    return {
        text: cellText,
        id: extractedId,
        studentCover,
        linkType
    };
}

export { extractStudentData };

