export function compressImage(file) {
    return new Promise((resolve, reject) => {
        const maxWidth = 800;
        const maxHeight = 800;
        const image = new Image();
        image.src = URL.createObjectURL(file);

        image.onload = () => {
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                }
            } else {
                if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.7);
            resolve(dataUrl);
        };

        image.onerror = (error) => reject(error);
    });
}