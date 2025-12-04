// config/multer.js o donde tengas la configuración de multer
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Crear directorio de uploads si no existe
const uploadDir = path.join(process.cwd(), 'uploads');
// Crear directorio de forma síncrona
if (!fs.existsSync(uploadDir)) {
  console.log('Creando directorio uploads en:', uploadDir);
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Directorio creado exitosamente');
} else {
  console.log('Directorio uploads ya existe en:', uploadDir);
}
// 2. Configurar almacenamiento en DISCO (no memoria)
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir); // Carpeta donde se guardarán
  },
  filename: function(req, file, cb) {
    // Generar nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.originalname}`);
  }
});

// 3. Crear instancia de multer con diskStorage
const upload = multer({
  storage: storage, // 👈 IMPORTANTE: usar diskStorage, no memoryStorage
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Opcional: validar tipos de archivo
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'), false);
    }
  }
});

module.exports = upload;