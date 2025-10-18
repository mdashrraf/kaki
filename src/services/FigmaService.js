// Figma Integration Service
// This service helps connect to Figma and import designs

import axios from 'axios';

class FigmaService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseURL = 'https://api.figma.com/v1';
    this.headers = {
      'X-Figma-Token': accessToken,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get file information from Figma
   * @param {string} fileKey - The Figma file key from URL
   * @returns {Promise<Object>} File data
   */
  async getFile(fileKey) {
    try {
      const response = await axios.get(`${this.baseURL}/files/${fileKey}`, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Figma file:', error);
      throw error;
    }
  }

  /**
   * Get specific node from Figma file
   * @param {string} fileKey - The Figma file key
   * @param {string} nodeId - The node ID to fetch
   * @returns {Promise<Object>} Node data
   */
  async getNode(fileKey, nodeId) {
    try {
      const response = await axios.get(`${this.baseURL}/files/${fileKey}/nodes`, {
        headers: this.headers,
        params: {
          ids: nodeId,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Figma node:', error);
      throw error;
    }
  }

  /**
   * Get images from Figma file
   * @param {string} fileKey - The Figma file key
   * @param {Array<string>} nodeIds - Array of node IDs
   * @param {string} format - Image format (png, jpg, svg, pdf)
   * @param {number} scale - Image scale (1, 2, 3)
   * @returns {Promise<Object>} Images data
   */
  async getImages(fileKey, nodeIds, format = 'png', scale = 2) {
    try {
      const response = await axios.get(`${this.baseURL}/images/${fileKey}`, {
        headers: this.headers,
        params: {
          ids: nodeIds.join(','),
          format,
          scale,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching Figma images:', error);
      throw error;
    }
  }

  /**
   * Download image from URL
   * @param {string} url - Image URL
   * @param {string} filename - Local filename
   * @returns {Promise<string>} Local file path
   */
  async downloadImage(url, filename) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
      });
      
      // In React Native, you would save this to the file system
      // For now, we'll return the URL
      return url;
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Extract file key from Figma URL
   * @param {string} figmaUrl - Full Figma URL
   * @returns {string} File key
   */
  extractFileKey(figmaUrl) {
    const match = figmaUrl.match(/\/file\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }

  /**
   * Convert Figma node to React Native component data
   * @param {Object} node - Figma node
   * @returns {Object} Component data
   */
  convertNodeToComponent(node) {
    const component = {
      id: node.id,
      name: node.name,
      type: node.type,
      styles: {},
      children: [],
    };

    // Extract styles
    if (node.absoluteBoundingBox) {
      component.styles = {
        width: node.absoluteBoundingBox.width,
        height: node.absoluteBoundingBox.height,
        x: node.absoluteBoundingBox.x,
        y: node.absoluteBoundingBox.y,
      };
    }

    // Extract fills (background colors)
    if (node.fills && node.fills.length > 0) {
      const fill = node.fills[0];
      if (fill.type === 'SOLID') {
        component.styles.backgroundColor = this.figmaColorToHex(fill.color);
      }
    }

    // Extract text properties
    if (node.type === 'TEXT') {
      component.styles.fontSize = node.style?.fontSize || 16;
      component.styles.fontWeight = node.style?.fontWeight || 'normal';
      component.styles.color = this.figmaColorToHex(node.fills?.[0]?.color);
    }

    // Process children
    if (node.children) {
      component.children = node.children.map(child => this.convertNodeToComponent(child));
    }

    return component;
  }

  /**
   * Convert Figma color to hex
   * @param {Object} color - Figma color object
   * @returns {string} Hex color
   */
  figmaColorToHex(color) {
    if (!color) return '#000000';
    
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = color.a || 1;
    
    if (a < 1) {
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
}

export default FigmaService;
