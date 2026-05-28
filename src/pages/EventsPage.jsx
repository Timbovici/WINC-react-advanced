import React, { useContext, useState } from 'react';
import { Heading, Box, SimpleGrid, Image, Text, Flex, Input, Skeleton, SkeletonText } from '@chakra-ui/react'; 
import { EventContext } from '../components/EventContext'; 
import { Link } from 'react-router-dom'; 

export const EventsPage = () => {
  const { events, categories, loading } = useContext(EventContext);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  const formatTime = (timeString) => {
    const date = new Date(timeString);
    return date.toLocaleString([], {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const handleCategoryToggle = (categoryId) => {
    const numId = Number(categoryId); 
    setSelectedCategories((prev) => {
      if (prev.includes(numId)) {
        return prev.filter(id => id !== numId);
      } else {
        return [...prev, numId];
      }
    });
  };

  const matchedEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Zorg dat we arrays van nummers vergelijken om de "games" bug te voorkomen
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(selectedId => 
        event.categoryIds.map(id => Number(id)).includes(selectedId)
      );

    return matchesSearch && matchesCategory;
  });

  return (
    <Box p={8} bg="white" color="black" minH="100vh">
      <Heading mb={6}>Alle Evenementen</Heading>
      
      <Input 
        placeholder="Zoek op titel van een evenement..." 
        mb={4} 
        size="lg"
        bg="white"
        color="black"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

      <Box mb={8} p={4} bg="gray.50" borderRadius="md" borderWidth="1px">
        <Text fontWeight="bold" mb={2} color="black">
          Filter op categorie:
        </Text>
        
      {loading ? (
          <Flex wrap="wrap" gap={4}>
            <Skeleton height="24px" width="75px" />  {/* Voor: [v] sports */}
            <Skeleton height="24px" width="75px" />  {/* Voor: [v] games */}
            <Skeleton height="24px" width="110px" /> {/* Voor: [v] relaxation (langste woord) */}
            <Skeleton height="24px" width="70px" />  {/* Voor: [v] music */}
          </Flex>
        ) : (
          <Flex wrap="wrap" gap={4}>
            {categories.map(category => (
              <label 
                key={category.id} 
                style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: 'black' }}
              >
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(Number(category.id))}
                  onChange={() => handleCategoryToggle(category.id)} 
                />
                {category.name}
              </label>
            ))}
          </Flex>
        )}
      </Box>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {loading ? (
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
            <Box key={item} borderWidth="1px" borderRadius="lg" overflow="hidden" shadow="md" bg="white" height="100%">
              <Skeleton height="200px" width="100%" />
              <Box p={4}>
                <Skeleton height="24px" width="60%" mb={2} />
                <SkeletonText noOfLines={2} spacing="4" mb={3} />
                <Skeleton height="16px" width="40%" mb={1} />
                <Skeleton height="16px" width="40%" mb={3} />
                <Flex gap={2} wrap="wrap">
                  <Skeleton height="24px" width="60px" borderRadius="md" />
                  <Skeleton height="24px" width="80px" borderRadius="md" />
                </Flex>
              </Box>
            </Box>
          ))
        ) : (
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
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  height="200px" 
                  width="100%" 
                  objectFit="cover" 
                />
                <Box p={4}>
                  <Heading size="md" mb={2} color="black">{event.title}</Heading>
                  <Text noOfLines={2} color="gray.600" mb={3}>{event.description}</Text>
                  
                  <Text fontSize="xs" color="gray.500">
                    <strong>Start:</strong> {formatTime(event.startTime)}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mb={3}>
                    <strong>Eind:</strong> {formatTime(event.endTime)}
                  </Text>

                  <Flex gap={2} wrap="wrap">
                    {event.categoryIds.map((categoryId) => {
                      const category = categories.find((c) => Number(c.id) === Number(categoryId));
                      return category ? (
                        <Box 
                          key={category.id} 
                          bg="teal.100" 
                          color="teal.800" 
                          px={2} 
                          py={1} 
                          borderRadius="md" 
                          fontSize="xs" 
                          fontWeight="bold"
                        >
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

      {!loading && matchedEvents.length === 0 && (
        <Text color="gray.500" mt={4}>
          Geen evenementen gevonden met deze filters...
        </Text>
      )}
    </Box>
  );
};