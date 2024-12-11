import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CircularProgress,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { toast } from "react-toastify";
import { shopifyCreateProduct } from "services";
import PropTypes from "prop-types";

const PublishProductDialog = ({
  open,
  onClose,
  loading,
  setLoading,
  additionalInfo,
  suggestedPrice,
}) => {
  const [selectedImages, setSelectedImages] = useState([]); // Multiple image selection
  const [selectedTitle, setSelectedTitle] = useState(null); // Single title selection
  const [selectedDescription, setSelectedDescription] = useState(null); // Single description selection
  const [editingTitleIndex, setEditingTitleIndex] = useState(null); // Index of the title being edited
  const [editingDescriptionIndex, setEditingDescriptionIndex] = useState(null); // Index of the description being edited

  const [productTitles, setProductTitles] = useState([]);
  const [productDescriptions, setProductDescriptions] = useState([]);
  const [imageURLs, setImageURLs] = useState([]);

  useEffect(() => {
    if (additionalInfo) {
      setProductTitles([...additionalInfo.productTitles]);
      setProductDescriptions([...additionalInfo.productDescriptions]);
      setImageURLs([...additionalInfo.imageURLs]);
      // Set default selections
      setSelectedImages([...Array(additionalInfo.imageURLs.length).keys()]);
      setSelectedTitle(0);
      setSelectedDescription(0);
    }
  }, [additionalInfo]);

  // Handle image selection
  const handleImageToggle = (index) => {
    setSelectedImages((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  // Handle title selection
  const handleTitleSelect = (index) => {
    setSelectedTitle(index);
  };

  // Handle description selection
  const handleDescriptionSelect = (index) => {
    setSelectedDescription(index);
  };

  // Enable editing mode for title
  const handleTitleDoubleClick = (index) => {
    setEditingTitleIndex(index);
  };

  // Enable editing mode for description
  const handleDescriptionDoubleClick = (index) => {
    setEditingDescriptionIndex(index);
  };

  // Update title while editing
  const handleTitleChange = (event, index) => {
    const newTitles = [...productTitles];
    newTitles[index] = event.target.value;
    setProductTitles(newTitles);
  };

  // Update description while editing
  const handleDescriptionChange = (event, index) => {
    const newDescriptions = [...productDescriptions];
    newDescriptions[index] = event.target.value;
    setProductDescriptions(newDescriptions);
  };

  // Exit editing mode
  const handleEditComplete = () => {
    setEditingTitleIndex(null);
    setEditingDescriptionIndex(null);
  };

  // Check if the publish button should be disabled
  const isPublishDisabled =
    selectedImages.length === 0 || selectedTitle === null || selectedDescription === null;

  // Handle publishing the product
  const handlePublish = async () => {
    if (isPublishDisabled) return;

    setLoading(true);
    const selectedTitleText = productTitles[selectedTitle];
    const selectedDescriptionText = productDescriptions[selectedDescription];
    const selectedImagesUrls = selectedImages.map((index) => imageURLs[index]);
    onClose();

    // Create the product on Shopify
    const publishPromise = shopifyCreateProduct({
      title: selectedTitleText,
      descriptionHTML: selectedDescriptionText,
      price: suggestedPrice,
      imageURLs: selectedImagesUrls.join(","),
    });

    // Handle the promise with toast notifications
    toast.promise(
      publishPromise,
      {
        pending: "Publishing product...",
        success: "Product published successfully 👌",
        error: "Error publishing product 🤯",
      },
      {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      }
    );

    try {
      const response = await publishPromise;
      console.log("Product created:", response);
    } catch (error) {
      console.error("Error publishing product:", error);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Additional Product Information</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : additionalInfo ? (
          <>
            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Select Images:
            </Typography>
            <Grid container spacing={1}>
              {imageURLs.map((url, index) => (
                <Grid item xs={2} key={index}>
                  <Card
                    sx={{
                      border: selectedImages.includes(index) ? "2px solid blue" : "1px solid gray",
                      cursor: "pointer",
                      overflow: "hidden",
                      aspectRatio: "1 / 1",
                      transition: "transform 0.2s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                    onClick={() => handleImageToggle(index)}
                  >
                    <MDBox
                      component="img"
                      src={url}
                      alt={`Product ${index}`}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <Checkbox
                      checked={selectedImages.includes(index)}
                      sx={{ position: "absolute", top: 0, right: 0 }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Select a Title:
            </Typography>
            <List>
              {productTitles.map((title, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedTitle === index}
                  onClick={() => handleTitleSelect(index)}
                  onDoubleClick={() => handleTitleDoubleClick(index)}
                >
                  {editingTitleIndex === index ? (
                    <TextField
                      value={title}
                      onChange={(e) => handleTitleChange(e, index)}
                      onBlur={handleEditComplete}
                      autoFocus
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <ListItemText primary={title} />
                  )}
                </ListItemButton>
              ))}
            </List>

            <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
              Select a Description:
            </Typography>
            <List>
              {productDescriptions.map((desc, index) => (
                <ListItemButton
                  key={index}
                  selected={selectedDescription === index}
                  onClick={() => handleDescriptionSelect(index)}
                  onDoubleClick={() => handleDescriptionDoubleClick(index)}
                >
                  {editingDescriptionIndex === index ? (
                    <TextField
                      value={desc}
                      onChange={(e) => handleDescriptionChange(e, index)}
                      onBlur={handleEditComplete}
                      autoFocus
                      fullWidth
                      size="small"
                    />
                  ) : (
                    <ListItemText primary={desc} />
                  )}
                </ListItemButton>
              ))}
            </List>
          </>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No additional information available. Press Enhance Product to load.
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        <MDButton onClick={onClose} color="secondary">
          Close
        </MDButton>
        <MDButton color="primary" disabled={isPublishDisabled} onClick={handlePublish}>
          Publish Product
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

// validar props
PublishProductDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  setLoading: PropTypes.func.isRequired,
  additionalInfo: PropTypes.object,
  suggestedPrice: PropTypes.number,
};

export default PublishProductDialog;
