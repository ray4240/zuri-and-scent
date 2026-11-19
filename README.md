# Zuri & Scent — Luxury Coastal Deras & Fine Perfumery Storefront

A modular, multi-file e-commerce project structured for clean development in **Visual Studio Code**.

## Project Folder Structure

```text
zuri-and-scent/
├── index.html                  # Main storefront structure & sections
├── css/
│   └── styles.css              # Custom luxury styling, animations & glassmorphism
├── js/
│   ├── products.js             # Product catalog (Deras, Women's & Men's Perfumes, Bundles)
│   └── app.js                  # Cart logic, 5% combo discount engine, Style Quiz & WhatsApp checkout
└── assets/
    ├── images/
    │   ├── deras/              # Your 5 uploaded Dera product photos (already linked!)
    │   └── perfumes/           # Optional folder for local perfume bottle photos
    └── videos/                 # Drop your Pexels coastal video here as 'coastal-campaign.mp4'
```

## How to Run & Edit in VS Code

1. Extract `zuri-and-scent.zip` to your Desktop or Projects folder.
2. In VS Code, go to **File > Open Folder...** and select the `zuri-and-scent` folder.
3. Click **Go Live** (Live Server extension) in the bottom-right status bar to preview with auto-reload.
4. To update prices, descriptions, or add new products, edit `js/products.js`.
5. Update `BUSINESS_WHATSAPP` at the top of `js/app.js` with your real business phone number (`2547XXXXXXXX`).
