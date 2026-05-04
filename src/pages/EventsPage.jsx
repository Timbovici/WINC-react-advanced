import React, { useContext, useState } from 'react';
import { Heading, Box, SimpleGrid, Image, Text, Flex, Input, Skeleton, SkeletonText } from '@chakra-ui/react'; 
import { EventContext } from '../components/EventContext'; 
import { Link } from 'react-router-dom'; 

export const EventsPage = () => {
  const { events, categories, loading } = useContext(EventContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Hulpfunctie voor de tijdnotatie op de kaartjes
  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString([], {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // De zeef (filter) logica
  const matchedEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(categoryId => event.categoryIds.includes(categoryId));

    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={8}>
      <Heading mb={6}>Alle Evenementen</Heading>
      
      {/* Zoekbalk */}
      <Input 
        placeholder="Zoek op titel van een evenement..." 
        mb={4} 
        size="lg"
        bg="white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      {/* Categorie Filters */}
      <Box mb={8} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
        <Text fontWeight="bold" mb={2}>Filter op categorie:</Text>
        <Flex wrap="wrap" gap={4}>
          {categories.map(category => (
            <label key={category.id} style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <input 
                type="checkbox" 
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)} 
              />
              {category.name}
            </label>
          ))}
        </Flex>
      </Box>

      {/* De Grid met resultaten (of Skeletons) */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {loading ? (
          // Toon 6 nep-kaartjes (skeletons) tijdens het laden
          [1, 2, 3, 4, 5, 6].map((item) => (
            <Box key={item} p={4} borderWidth="1px" borderRadius="lg" bg="white">
              <Skeleton height="200px" borderRadius="md" mb={4} />
              <Skeleton height="20px" width="70%" mb={2} />
              <SkeletonText noOfLines={3} spacing="4" />
            </Box>
          ))
        ) : (
          // Toon de echte evenementen
          matchedEvents.map((event) => (
            <Link key={event.id} to={`/event/${event.id}`}>
              <Box 
                borderWidth="1px" 
                borderRadius="lg" 
                overflow="hidden" 
                shadow="md" 
                bg="white"
                _hover={{ transform: 'scale(1.02)', transition: '0.2s' }} 
                height="100%"
              >
                <Image src={event.image} alt={event.title} height="200px" width="100%" objectFit="cover" />
                <Box p={4}>
                  <Heading size="md" mb={2}>{event.title}</Heading>
                  <Text noOfLines={2} color="gray.600" mb={3}>{event.description}</Text>
                  
                  <Text fontSize="xs" color="gray.500"><strong>Start:</strong> {formatTime(event.startTime)}</Text>
                  <Text fontSize="xs" color="gray.500" mb={3}><strong>Eind:</strong> {formatTime(event.endTime)}</Text>

                  <Flex gap={2} wrap="wrap">
                    {event.categoryIds.map((categoryId) => {
                      const category = categories.find((c) => c.id == categoryId);
                      return category ? (
                        <Box key={category.id} bg="teal.100" color="teal.800" px={2} py={1} borderRadius="md" fontSize="xs" fontWeight="bold">
                          {category.name}
                        </Box>
                      ) : null;
                    })}
                  </Flex>
                </Box>
              </Box>
            </Link>
          ))
        )}
      </SimpleGrid>

      {/* Melding als er niks gevonden is */}
      {!loading && matchedEvents.length === 0 && (
        <Text color="gray.500" mt={4}>Geen evenementen gevonden met deze filters...</Text>
      )}
    </Box>
  );
};