import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import FigmaService from '../services/FigmaService';

const FigmaImporter = () => {
  const [accessToken, setAccessToken] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileData, setFileData] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleConnect = async () => {
    if (!accessToken || !figmaUrl) {
      Alert.alert('Error', 'Please enter both access token and Figma URL');
      return;
    }

    setIsLoading(true);
    try {
      const figmaService = new FigmaService(accessToken);
      const fileKey = figmaService.extractFileKey(figmaUrl);
      
      if (!fileKey) {
        Alert.alert('Error', 'Invalid Figma URL');
        return;
      }

      const file = await figmaService.getFile(fileKey);
      setFileData(file);
      Alert.alert('Success', 'Connected to Figma file successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Figma: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportNode = async (nodeId) => {
    if (!accessToken || !figmaUrl) {
      Alert.alert('Error', 'Please connect to Figma first');
      return;
    }

    setIsLoading(true);
    try {
      const figmaService = new FigmaService(accessToken);
      const fileKey = figmaService.extractFileKey(figmaUrl);
      
      // Get node data
      const nodeData = await figmaService.getNode(fileKey, nodeId);
      const node = nodeData.nodes[nodeId];
      
      // Get images if needed
      const images = await figmaService.getImages(fileKey, [nodeId], 'svg', 2);
      
      // Convert to component
      const component = figmaService.convertNodeToComponent(node.document);
      
      // Generate React Native component code
      const componentCode = generateComponentCode(component, images.images[nodeId]);
      
      Alert.alert('Success', 'Component imported successfully! Check the console for the generated code.');
      console.log('Generated Component Code:', componentCode);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to import node: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateComponentCode = (component, imageUrl) => {
    const componentName = component.name.replace(/\s+/g, '');
    
    return `
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
${imageUrl ? "import { SvgXml } from 'react-native-svg';" : ''}

const ${componentName} = () => {
  return (
    <View style={styles.container}>
      ${component.children.map(child => generateChildCode(child)).join('\n      ')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: ${component.styles.width || 'auto'},
    height: ${component.styles.height || 'auto'},
    backgroundColor: '${component.styles.backgroundColor || 'transparent'}',
  },
});

export default ${componentName};
`;
  };

  const generateChildCode = (child) => {
    if (child.type === 'TEXT') {
      return `<Text style={styles.${child.name.toLowerCase().replace(/\s+/g, '')}}>${child.name}</Text>`;
    }
    return `<View style={styles.${child.name.toLowerCase().replace(/\s+/g, '')}} />`;
  };

  const renderNodeTree = (nodes, level = 0) => {
    return nodes.map((node) => (
      <View key={node.id} style={[styles.nodeItem, { marginLeft: level * 20 }]}>
        <TouchableOpacity
          style={styles.nodeButton}
          onPress={() => handleImportNode(node.id)}
        >
          <Text style={styles.nodeText}>
            {node.type}: {node.name}
          </Text>
        </TouchableOpacity>
        {node.children && renderNodeTree(node.children, level + 1)}
      </View>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Figma Importer</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Figma Access Token:</Text>
        <TextInput
          style={styles.input}
          value={accessToken}
          onChangeText={setAccessToken}
          placeholder="Enter your Figma access token"
          secureTextEntry
        />
        <Text style={styles.helpText}>
          Get your token from: Figma → Settings → Account → Personal Access Tokens
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Figma File URL:</Text>
        <TextInput
          style={styles.input}
          value={figmaUrl}
          onChangeText={setFigmaUrl}
          placeholder="https://www.figma.com/file/..."
        />
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Connect to Figma</Text>
        )}
      </TouchableOpacity>

      {fileData && (
        <View style={styles.fileInfo}>
          <Text style={styles.fileTitle}>File: {fileData.name}</Text>
          <Text style={styles.fileSubtitle}>
            {fileData.document.children.length} pages
          </Text>
          
          <Text style={styles.sectionTitle}>Available Components:</Text>
          {renderNodeTree(fileData.document.children)}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  fileInfo: {
    marginTop: 20,
  },
  fileTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  fileSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  nodeItem: {
    marginBottom: 5,
  },
  nodeButton: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  nodeText: {
    fontSize: 14,
  },
});

export default FigmaImporter;
