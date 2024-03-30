import torch
from ultralytics import YOLO
import torch
from torch.utils.data import DataLoader
import os
import cv2 as cv2

model = YOLO('yolov8n.pt')

# Access model configuration
# model.yaml["nc"] = 1  # Set number of classes to 1 (pen)
# Adjust other parameters as needed (e.g., anchors)

# Update model configuration
# model = model.autoshape()

# Assuming your dataset is organized like this:
# root_folder/
#   train/
#     images/
#       ... (your training images)
#     labels/
#       ... (your training annotations)
#   val/
#     images/
#       ... (your validation images)
#     labels/
#       ... (your validation annotations)

root_folder = r"C:/Users/TIRATH BHATHAWALA/Downloads/pen.v1-pen-version2.yolov8"

# Define a custom dataset class that loads images and annotations
class PenDetectionDataset(torch.utils.data.Dataset):
    def __init__(self, root_folder, split="train", transform=None):
        self.root_folder = root_folder
        self.split = split
        self.image_filenames = [f for f in os.listdir(os.path.join(root_folder, split, "images"))
                                 if f.endswith((".jpg", ".png", ".jpeg"))]
        self.label_paths = [os.path.join(root_folder, split, "labels", f)
                             for f in self.image_filenames]
        self.transform = transform  # Optional transformation for images

    def __len__(self):
        return len(self.image_filenames)

    def __getitem__(self, idx):
        image_path = os.path.join(self.root_folder, self.split, "images", self.image_filenames[idx])
        label_path = self.label_paths[idx]

        # Load image (replace with your image loading function)
        image = cv2.imread(image_path)  # Assuming OpenCV for image loading
        image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # Convert to RGB if needed

        # Load and parse annotations (replace with your annotation parsing logic)
        # Parse YOLO annotations
        targets = []  # List to store ground truth data (bounding boxes and class labels)
        if os.path.isfile(label_path):
            with open(label_path, "r") as f:
                for line in f.readlines():
                    values = [float(x) for x in line.split()]  # Split line and convert to float

                    # YOLO format (x_center, y_center, width, height, class_id)
                    class_id = int(values[-1])  # Last element is class ID
                    x_center, y_center, width, height = values[:-1]

                    # Normalize coordinates (convert from pixel values to 0-1 range)
                    image_width, image_height = image.shape[1], image.shape[0]
                    x_center = x_center / image_width
                    y_center = y_center / image_height
                    width = width / image_width
                    height = height / image_height

                    # Create a dictionary for each bounding box and class
                    target = {"bbox": [x_center, y_center, width, height], "class_id": class_id}
                    targets.append(target)
        else:
            print(f"Warning: Annotation file not found: {label_path}")

        if self.transform:
            image, targets = self.transform(image, targets)

        return image, targets


# Create training and validation datasets
train_dataset = PenDetectionDataset(root_folder, split="train")
val_dataset = PenDetectionDataset(root_folder, split="valid")

# Define data loaders with desired batch size
train_dataloader = DataLoader(train_dataset, batch_size=32, shuffle=True)
val_dataloader = DataLoader(val_dataset, batch_size=16, shuffle=False)  # Don't shuffle validation data

optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
epochs = 100

for epoch in range(epochs):
    # Train on each batch of data
    for images, targets in train_dataloader:
        losses = model(images, targets)
        optimizer.zero_grad()
        losses.backward()
        optimizer.step()

    # Evaluate on validation set
    model.eval()
    with torch.no_grad():
        val_losses = model(val_images, val_targets)
    model.train()

    # Print training and validation loss
    print(f"Epoch {epoch+1}/{epochs}, Train Loss: {losses.sum():.4f}, Val Loss: {val_losses.sum():.4f}")

model.save("yolov5s_pen_detector.pt")

