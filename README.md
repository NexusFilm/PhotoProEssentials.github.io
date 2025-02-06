# Contract Template Manager

A web application for freelance photographers and filmmakers to access and manage industry-specific contract templates. This platform provides an intuitive interface for browsing, viewing, and uploading contract templates with automated cover image generation.

## 🚀 Features

- **Template Library**: Browse through a curated list of industry-specific contract templates
- **Detailed Views**: Access comprehensive information about key clauses and legal considerations
- **Smart Navigation**: Seamlessly switch between templates and categories
- **Document Upload**: Upload custom templates with automatically generated cover images
- **Responsive Design**: Optimized for both desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend Framework**: React
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Icons**: Lucide React
- **Image Generation**: html2canvas

## 📁 Project Structure

```
src/
├── components/
│   ├── sidebar/
│   │   └── sidebar.tsx
│   ├── documents/
│   │   ├── document-list.tsx
│   │   ├── document-details.tsx
│   │   └── document-upload.tsx
│   └── layout/
│       ├── header.tsx
│       └── footer.tsx
├── app.tsx
└── styles/
    └── globals.css
```

## 🏗️ Components Overview

### Sidebar Component
- Displays template categories
- Handles category selection and filtering

### Document List Component
- Shows templates with descriptions
- Displays cover images and basic information

### Document Details Component
- Presents detailed template information
- Explains key clauses and legal considerations

### Document Upload Component
- Manages document uploads
- Generates cover images automatically

## 🚦 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/contract-template-manager.git
```

2. Install dependencies:
```bash
cd contract-template-manager
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 💻 Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Available Scripts
- `npm run dev`: Starts development server
- `npm run build`: Builds the production application
- `npm run start`: Runs the production server
- `npm run lint`: Runs ESLint
- `npm run test`: Runs test suite

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## 📧 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/contract-template-manager](https://github.com/yourusername/contract-template-manager)
