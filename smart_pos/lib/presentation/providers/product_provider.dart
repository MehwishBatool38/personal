import 'package:flutter/material.dart';
import '../../data/models/product_model.dart';
import '../../data/local/database/sqlite_database.dart';
import '../../data/local/database/dao/product_dao.dart';

class ProductProvider with ChangeNotifier {
  final SQLiteDatabase _dbHelper = SQLiteDatabase();
  ProductDao? _productDao;

  List<Product> _products = [];
  List<Product> _filteredProducts = [];
  List<String> _categories = [];
  bool _isLoading = false;
  String _searchQuery = '';
  String _selectedCategory = 'All';
  String _sortBy = 'name';
  bool _showOnlyLowStock = false;

  // Getters
  List<Product> get products => _filteredProducts;
  List<Product> get allProducts => _products;
  List<String> get categories => _categories;
  bool get isLoading => _isLoading;
  String get searchQuery => _searchQuery;
  String get selectedCategory => _selectedCategory;
  String get sortBy => _sortBy;
  bool get showOnlyLowStock => _showOnlyLowStock;

  // Initialize provider
  Future<void> initialize() async {
    if (_productDao == null) {
      final db = await _dbHelper.database;
      _productDao = ProductDao(db);
    }
    await _loadProducts();
    await _loadCategories();
  }

  // Load all products
  Future<void> _loadProducts() async {
    _setLoading(true);
    try {
      _products = await _productDao!.getAllProducts();
      _applyFilters();
    } catch (e) {
      print('Error loading products: $e');
      _products = [];
      _filteredProducts = [];
    } finally {
      _setLoading(false);
    }
  }

  // Load categories
  Future<void> _loadCategories() async {
    try {
      final categories = await _productDao!.getCategories();
      _categories = ['All', ...categories];
    } catch (e) {
      print('Error loading categories: $e');
      _categories = ['All'];
    }
  }

  // Add new product
  Future<bool> addProduct(Product product) async {
    try {
      // Generate SKU if not provided
      if (product.sku.isEmpty) {
        product = product.copyWith(
          sku: 'SKU${DateTime.now().millisecondsSinceEpoch}',
        );
      }

      // Set timestamps
      final now = DateTime.now();
      product = product.copyWith(
        createdAt: now,
        updatedAt: now,
      );

      final id = await _productDao!.insertProduct(product);
      if (id > 0) {
        await _loadProducts();
        await _loadCategories();
        return true;
      }
      return false;
    } catch (e) {
      print('Error adding product: $e');
      return false;
    }
  }

  // Update product
  Future<bool> updateProduct(Product product) async {
    try {
      product = product.copyWith(
        updatedAt: DateTime.now(),
      );

      final rows = await _productDao!.updateProduct(product);
      if (rows > 0) {
        await _loadProducts();
        return true;
      }
      return false;
    } catch (e) {
      print('Error updating product: $e');
      return false;
    }
  }

  // Delete product
  Future<bool> deleteProduct(int id) async {
    try {
      final rows = await _productDao!.deleteProduct(id);
      if (rows > 0) {
        await _loadProducts();
        await _loadCategories();
        return true;
      }
      return false;
    } catch (e) {
      print('Error deleting product: $e');
      return false;
    }
  }

  // Soft delete product
  Future<bool> softDeleteProduct(int id) async {
    try {
      final rows = await _productDao!.softDeleteProduct(id);
      if (rows > 0) {
        await _loadProducts();
        await _loadCategories();
        return true;
      }
      return false;
    } catch (e) {
      print('Error soft deleting product: $e');
      return false;
    }
  }

  // Update stock quantity
  Future<bool> updateStock(int id, int newQuantity) async {
    try {
      final rows = await _productDao!.updateStock(id, newQuantity);
      if (rows > 0) {
        await _loadProducts();
        return true;
      }
      return false;
    } catch (e) {
      print('Error updating stock: $e');
      return false;
    }
  }

  // Search products
  Future<void> searchProducts(String query) async {
    _searchQuery = query;
    _applyFilters();
  }

  // Filter by category
  void filterByCategory(String category) {
    _selectedCategory = category;
    _applyFilters();
  }

  // Toggle low stock filter
  void toggleLowStockFilter(bool value) {
    _showOnlyLowStock = value;
    _applyFilters();
  }

  // Sort products
  void sortProducts(String sortBy) {
    _sortBy = sortBy;
    _applyFilters();
  }

  // Apply all filters
  void _applyFilters() {
    List<Product> filtered = List.from(_products);

    // Apply category filter
    if (_selectedCategory != 'All') {
      filtered = filtered.where((p) => p.category == _selectedCategory).toList();
    }

    // Apply low stock filter
    if (_showOnlyLowStock) {
      filtered = filtered.where((p) => p.isLowStock).toList();
    }

    // Apply search filter
    if (_searchQuery.isNotEmpty) {
      final query = _searchQuery.toLowerCase();
      filtered = filtered.where((p) {
        return p.name.toLowerCase().contains(query) ||
            p.sku.toLowerCase().contains(query) ||
            p.barcode.toLowerCase().contains(query) ||
            p.description.toLowerCase().contains(query);
      }).toList();
    }

    // Apply sorting
    filtered.sort((a, b) {
      switch (_sortBy) {
        case 'name':
          return a.name.compareTo(b.name);
        case 'price_high':
          return b.price.compareTo(a.price);
        case 'price_low':
          return a.price.compareTo(b.price);
        case 'quantity_low':
          return a.quantity.compareTo(b.quantity);
        case 'recent':
          return b.updatedAt.compareTo(a.updatedAt);
        default:
          return a.name.compareTo(b.name);
      }
    });

    _filteredProducts = filtered;
    notifyListeners();
  }

  // Get low stock products
  Future<List<Product>> getLowStockProducts() async {
    try {
      return await _productDao!.getLowStockProducts();
    } catch (e) {
      print('Error getting low stock products: $e');
      return [];
    }
  }

  // Get product by ID
  Future<Product?> getProductById(int id) async {
    try {
      return await _productDao!.getProductById(id);
    } catch (e) {
      print('Error getting product by id: $e');
      return null;
    }
  }

  // Get product by SKU
  Future<Product?> getProductBySku(String sku) async {
    try {
      return await _productDao!.getProductBySku(sku);
    } catch (e) {
      print('Error getting product by sku: $e');
      return null;
    }
  }

  // Get statistics
  Future<Map<String, dynamic>> getStatistics() async {
    try {
      final totalProducts = await _productDao!.getTotalProductCount();
      final lowStockProducts = (await getLowStockProducts()).length;
      final totalValue = await _productDao!.getTotalInventoryValue();

      return {
        'totalProducts': totalProducts,
        'lowStockProducts': lowStockProducts,
        'totalValue': totalValue,
        'categories': _categories.length - 1, // Excluding 'All'
      };
    } catch (e) {
      print('Error getting statistics: $e');
      return {
        'totalProducts': 0,
        'lowStockProducts': 0,
        'totalValue': 0.0,
        'categories': 0,
      };
    }
  }

  // Refresh data
  Future<void> refresh() async {
    await _loadProducts();
    await _loadCategories();
  }

  void _setLoading(bool loading) {
    _isLoading = loading;
    notifyListeners();
  }

  // Clear all filters
  void clearFilters() {
    _searchQuery = '';
    _selectedCategory = 'All';
    _showOnlyLowStock = false;
    _sortBy = 'name';
    _applyFilters();
  }
}