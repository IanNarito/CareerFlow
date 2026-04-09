import sys
import base64
from io import BytesIO
from PIL import Image
from rembg import remove

def process_image(base64_str):
    try:
        # Decode the base64 string
        img_data = base64.b64decode(base64_str.split(',')[1])
        input_image = Image.open(BytesIO(img_data))
        
        # Remove background
        output_image = remove(input_image)
        
        # Create a solid white background image of the same size
        white_bg = Image.new("RGB", output_image.size, (255, 255, 255))
        
        # Paste the face onto the white background using the alpha channel as a mask
        white_bg.paste(output_image, (0, 0), output_image)
        
        # Save it to the server's public folder
        # Ensure you have a 'public/uploads' folder inside your server directory!
        file_name = f"profile_{sys.argv[1]}.jpg"
        file_path = f"./public/uploads/{file_name}"
        white_bg.save(file_path, "JPEG")
        
        # Print the URL so Node.js can read it
        print(f"http://localhost:5000/uploads/{file_name}")
        sys.stdout.flush()

    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    # Takes the user ID as an argument, and reads the Base64 string from standard input
    process_image(sys.stdin.read())