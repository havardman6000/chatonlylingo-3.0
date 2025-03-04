#!/bin/bash

# This script creates missing page components for all characters

# Function to create a page component
create_page() {
  local character=$1
  local language=$2
  local file_path="src/app/chat/$language/$character/page.tsx"
  
  # Capitalize first letter of character name for component name
  local component_name=$(echo "$character" | awk '{print toupper(substr($0,1,1)) tolower(substr($0,2))}')
  
  # Only create if file is empty or doesn't exist
  if [ ! -s "$file_path" ]; then
    echo "Creating page component for $component_name..."
    
    # Create the component with proper naming
    cat > "$file_path" << EOF
'use client';

import React, { useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';

export default function ${component_name}ChatPage() {
  useEffect(() => {
    // Preload assets or perform other initialization if needed
    document.title = 'Chat with ${component_name} | LingoBabe';
  }, []);

  return (
    <ChatInterface characterId="${character}" />
  );
}
EOF
    echo "Created $file_path"
  else
    echo "Skipping $file_path (already exists and not empty)"
  fi
}

# Create all Korean character pages
create_page "sua" "korean"
create_page "min" "korean"

# Create all Japanese character pages
create_page "misa" "japanese"
create_page "aya" "japanese"

# Create all Spanish character pages
create_page "valentina" "spanish"
create_page "sofia" "spanish"

echo "All missing page components created successfully!" 