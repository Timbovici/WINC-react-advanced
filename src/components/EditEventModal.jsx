import { Button, Input, Textarea, VStack, Box, Heading, Flex } from "@chakra-ui/react";
import { useState, useContext } from "react";
import { EventContext } from "./EventContext";

export const EditEventModal = ({ isOpen, onClose, event }) => {
  const { fetchAllData, categories } = useContext(EventContext);

  // Hulpfunctie om de tijd-notatie te trimmen naar wat de kalender begrijpt
  const formatForInput = (dateTimeString) => {
    if (!dateTimeString) return "";
    return dateTimeString.substring(0, 16); 
  };

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    image: event.image,
    location: event.location || "",
    startTime: formatForInput(event.startTime),
    endTime: formatForInput(event.endTime),
    categoryIds: event.categoryIds || [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (categoryId) => {
    setFormData((prev) => {
      if (prev.categoryIds.includes(categoryId)) {
        return { ...prev, categoryIds: prev.categoryIds.filter(id => id !== categoryId) };
      } else {
        return { ...prev, categoryIds: [...prev.categoryIds, categoryId] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/events/${event.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...event, ...formData }),
      });

      if (response.ok) {
        await fetchAllData(); 
        alert("Aanpassingen succesvol opgeslagen!"); 
        onClose(); 
      } else {
        alert("Kon de wijzigingen niet opslaan.");
      }
    } catch (error) {
      console.error("Netwerk fout:", error);
      alert("Fout bij verbinden met de server.");
    }
  };

  if (!isOpen) return null;

  return (
    <Box position="fixed" top="0" left="0" w="100vw" h="100vh" bg="blackAlpha.600" zIndex="1000" display="flex" alignItems="center" justifyContent="center">
      <Box bg="white" p={6} rounded="md" w="400px" maxW="90%" maxH="90vh" overflowY="auto" shadow="lg" color="black">
        <Heading size="md" mb={4}>Evenement Bewerken</Heading>
        
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <Box>
              <label>Titel</label>
              <Input name="title" value={formData.title} onChange={handleChange} required />
            </Box>
            <Box>
              <label>Beschrijving</label>
              <Textarea name="description" value={formData.description} onChange={handleChange} required />
            </Box>
            <Box>
              <label>Afbeelding URL</label>
              <Input name="image" value={formData.image} onChange={handleChange} required />
            </Box>
            <Box>
              <label>Locatie</label>
              <Input name="location" value={formData.location} onChange={handleChange} required />
            </Box>
            <Box>
              <label>Start Tijd</label>
              <Input 
                type="datetime-local" 
                name="startTime" 
                value={formData.startTime} 
                onInput={handleChange} 
                required 
              />
            </Box>
            <Box>
              <label>Eind Tijd</label>
              <Input 
                type="datetime-local" 
                name="endTime" 
                value={formData.endTime} 
                onInput={handleChange}
                required 
              />
            </Box>
            
            <Box>
              <label style={{ fontWeight: 'bold', marginBottom: '8px', display: 'block' }}>Categorieën</label>
              <Flex wrap="wrap" gap={3}>
                {categories.map(category => (
                  <label key={category.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={formData.categoryIds.includes(category.id)}
                      onChange={() => handleCategoryChange(category.id)} 
                    />
                    {category.name}
                  </label>
                ))}
              </Flex>
            </Box>
            
            <Flex justify="flex-end" gap={2} mt={4}>
              <Button type="button" onClick={onClose} variant="outline" colorScheme="red">Annuleren</Button>
              <Button type="submit" colorScheme="blue">Opslaan</Button>
            </Flex>
          </VStack>
        </form>
      </Box>
    </Box>
  );
};