import { setTimeout } from "node:timers/promises";

async function downloadHTMLTable(page, baseUrl, reportId) {
    console.log(`Descargando tabla HTML para reporte ID: ${reportId}`);

    const reportUrl = `${baseUrl}/reportbuilder/view.php?id=${reportId}`;
    await page.goto(reportUrl, { waitUntil: "networkidle2" });

    await setTimeout(3000);

    const formData = await page.evaluate(() => {
        const form = document.querySelector("form.dataformatselector");
        if (!form) return null;

        const sesskey = form.querySelector('input[name="sesskey"]')?.value;
        const reportId = form.querySelector('input[name="id"]')?.value;
        return { sesskey, reportId };
    });

    console.log('FORM DATA', formData);

    if (!formData || !formData.sesskey) {
        throw new Error("Error: No se pudo encontrar el formulario de descarga o el sesskey");
    }

    console.log("Sesskey obtenido:", formData.sesskey);

    const downloadUrl = `${baseUrl}/reportbuilder/download.php`;
    const response = await page.evaluate(
        async (url, sesskey, reportId) => {
            const formData = new FormData();
            formData.append("sesskey", sesskey);
            formData.append("download", "html");
            formData.append("id", reportId);

            const response = await fetch(url, {
                method: "POST",
                body: formData,
                credentials: "same-origin",
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        },
        downloadUrl,
        formData.sesskey,
        formData.reportId
    );

    console.log("Tabla HTML descargada exitosamente");
    return response;
}

export { downloadHTMLTable };

