
# Adelix Technical Department

This Vue.js project special for [AdelixTurkey](https://www.adelixturkiye.com/) provides a system for managing devices and generating printable PDF samples with serial numbers and other details. The project utilizes `jsPDF` and `html2canvas` libraries to capture HTML elements and convert them into PDF format, and includes a dynamic user interface for selecting and configuring devices.

## Features

- **Device Selection and Configuration**: Users can select devices from a predefined list, specify the quantity, and input serial numbers.
- **Dynamic Serial Number Handling**: Automatically adjusts the number of serial number fields based on the quantity selected for each device.
- **Country-specific Labeling**: For each serial number, users can toggle whether it is designated as Ukrainian.
- **PDF Generation**: A previewable and downloadable PDF is generated, with images and device details arranged dynamically based on user input.
- **Modals for Review and Device Details**: Pop-up modals allow users to review and confirm device configurations before generating a PDF.
- **User Authentication**: Users can log in with email and password using Supabase.
- **Automatic Updates**: The app checks for updates and prompts the user to install them.

## Technologies

- **Vue.js 3**: The core framework for building the front-end UI components.
- **jsPDF**: For creating and managing PDF files.
- **html2canvas**: Used to capture HTML elements as images for embedding in the PDF.
- **SCSS**: Custom styles for enhanced component presentation.
- **Electron**: For building cross-platform desktop applications.
- **Supabase**: For backend services including authentication and database.
- **SweetAlert2**: For modal pop-ups and alerts.