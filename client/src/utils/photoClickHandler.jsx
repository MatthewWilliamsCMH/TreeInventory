export const handlePhotoClick = (formValues, field, photoUrl) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (formValues.photos[photoUrl]) {
    window.open(formValues.photos[photoUrl], "_blank");
    return;
  }

  setIsModalOpen(true);
};