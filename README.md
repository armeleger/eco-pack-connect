# EcoPack Connect by Kayisire Kira Armel Leger

**Live Project URL:** [https://eco-pack-connect.vercel.app/](https://eco-pack-connect.vercel.app/)

Hi, welcome to the repository for my final Software Engineering prototype. EcoPack Connect is a B2B web application designed to connect businesses in Rwanda with sustainable packaging manufacturers in Kenya. 

## Tech Stack
* **Frontend:** Next.js 16 (App Router), React, Tailwind CSS
* **Backend / Database:** Supabase (PostgreSQL)
* **Image Hosting:** Cloudinary
* **Deployment:** Vercel

---

## How to Set Up and Run This Project Locally

If you are viewing this project, please follow these exact steps to get the application running on your local machine.

### Prerequisites
Before you start, make sure you have the following installed on your computer:
* [Node.js](https://nodejs.org/) (Version 18.x or higher)
* Git

### Step 1: Clone the repository
Open your terminal and clone this repository to your local machine, then move into the project folder:
```bash
git clone [https://github.com/armeleger/eco-pack-connect.git](https://github.com/armeleger/eco-pack-connect.git)
cd eco-pack-connect

Step 2: Install dependencies
Run the following command to install all the necessary packages required for the app to work:

Bash
npm install

Step 3: Configure Environment Variables
The app connects to a live Supabase database and Cloudinary for image uploads. To make this work locally, you need to set up your environment variables.

In the root directory of the project (right next to the package.json file), create a new file and name it exactly .env.local.

Open that new file and paste the following text into it. (Note: If you are my grader and need my actual API keys to test the database and image uploads, please refer to my submission notes or the live Vercel link, as security best practices prevent me from leaving raw database keys in this public README).

Code snippet
# Supabase Configuration (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Cloudinary Configuration (Image Uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_cloudinary_unsigned_preset_here
Step 4: Run the development server
Once your packages are installed and your .env.local file is saved, start the local server:

Bash
npm run dev

Step 5: View the app
Open your web browser and navigate to:
http://localhost:3000

The application should now be running smoothly on your machine.

THANK YOU.