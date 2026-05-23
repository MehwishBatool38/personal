import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../../data/models/product_model.dart';
import '../../providers/product_provider.dart';
// Remove these imports - they don't exist
// import 'add_edit_product_screen.dart';
// import '../../widgets/product_card.dart';
// import '../../widgets/empty_state.dart';

// Key parameter for ProductListScreen
class ProductListScreen extends StatefulWidget {
  const ProductListScreen({Key? key}) : super(key: key);

  @override
  _ProductListScreenState createState() => _ProductListScreenState();
}

class _ProductListScreenState extends State<ProductListScreen>
    with SingleTickerProviderStateMixin {

  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  final TextEditingController _searchController = TextEditingController();
  final FocusNode _searchFocusNode = FocusNode();

  bool _isSearching = false;
  String _selectedView = 'grid'; // 'grid' or 'list'

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 500),
    );

    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeIn,
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: Offset(0, 0.2),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      ),
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _animationController.forward();
      _initializeData();
    });
  }

  Future<void> _initializeData() async {
    // Check if widget is mounted before using context
    if (!mounted) return;

    final provider = Provider.of<ProductProvider>(context, listen: false);
    await provider.initialize();
  }

  @override
  void dispose() {
    _searchController.dispose();
    _searchFocusNode.dispose();
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final productProvider = Provider.of<ProductProvider>(context);
    final size = MediaQuery.of(context).size;

    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Column(
        children: [
          // Header with Search and Actions
          _buildHeader(context, productProvider),

          // Filters Bar
          _buildFiltersBar(productProvider),

          // Main Content
          Expanded(
            child: AnimatedBuilder(
              animation: _animationController,
              builder: (context, child) {
                return FadeTransition(
                  opacity: _fadeAnimation,
                  child: SlideTransition(
                    position: _slideAnimation,
                    child: productProvider.isLoading
                        ? _buildLoadingState()
                        : productProvider.products.isEmpty
                        ? _buildEmptyState(productProvider)
                        : _buildProductList(context, productProvider, size),
                  ),
                );
              },
            ),
          ),
        ],
      ),

      // Floating Action Button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {
          _navigateToAddProduct();
        },
        icon: Icon(Icons.add, size: 24),
        label: Text('Add Product'),
        backgroundColor: Colors.blue[700],
        foregroundColor: Colors.white,
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(50),
        ),
      ),
    );
  }

  // ============================================
  // WIDGET BUILDERS
  // ============================================

  Widget _buildHeader(BuildContext context, ProductProvider provider) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Products',
                      style: TextStyle(
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue[900],
                      ),
                    ),
                    SizedBox(height: 5),
                    Text(
                      'Manage your inventory',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.grey[600],
                      ),
                    ),
                  ],
                ),
              ),

              // Stats Chip
              FutureBuilder<Map<String, dynamic>>(
                future: provider.getStatistics(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Container();
                  }

                  final stats = snapshot.data ?? {
                    'totalProducts': 0,
                    'lowStockProducts': 0,
                    'totalValue': 0.0,
                  };

                  return Container(
                    padding: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.blue[50],
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Row(
                      children: [
                        Icon(Icons.inventory, size: 16, color: Colors.blue),
                        SizedBox(width: 6),
                        Text(
                          '${stats['totalProducts']} items',
                          style: TextStyle(
                            fontWeight: FontWeight.w600,
                            color: Colors.blue[700],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ),

          SizedBox(height: 15),

          // Search Bar
          Container(
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(15),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _searchController,
                    focusNode: _searchFocusNode,
                    decoration: InputDecoration(
                      hintText: 'Search products...',
                      border: InputBorder.none,
                      prefixIcon: Icon(Icons.search, color: Colors.grey[600]),
                      suffixIcon: _searchController.text.isNotEmpty
                          ? IconButton(
                        icon: Icon(Icons.close, size: 18),
                        onPressed: () {
                          _searchController.clear();
                          provider.searchProducts('');
                          setState(() {
                            _isSearching = false;
                          });
                        },
                      )
                          : null,
                      contentPadding: EdgeInsets.symmetric(vertical: 12, horizontal: 15),
                    ),
                    onChanged: (value) {
                      provider.searchProducts(value);
                      setState(() {
                        _isSearching = value.isNotEmpty;
                      });
                    },
                    onSubmitted: (value) {
                      provider.searchProducts(value);
                    },
                  ),
                ),

                // Scan Barcode Button
                IconButton(
                  onPressed: _scanBarcode,
                  icon: Icon(Icons.qr_code_scanner, color: Colors.blue[700]),
                  tooltip: 'Scan Barcode',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFiltersBar(ProductProvider provider) {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      color: Colors.white,
      child: Row(
        children: [
          // Category Filter
          Expanded(
            child: Container(
              height: 40,
              padding: EdgeInsets.symmetric(horizontal: 12),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(10),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: provider.selectedCategory,
                  icon: Icon(Icons.arrow_drop_down, color: Colors.grey[600]),
                  isExpanded: true,
                  items: provider.categories.map((category) {
                    return DropdownMenuItem(
                      value: category,
                      child: Text(
                        category,
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.grey[800],
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    );
                  }).toList(),
                  onChanged: (value) {
                    provider.filterByCategory(value!);
                  },
                ),
              ),
            ),
          ),

          SizedBox(width: 10),

          // Sort Button
          PopupMenuButton<String>(
            onSelected: (value) {
              provider.sortProducts(value);
            },
            itemBuilder: (context) => [
              PopupMenuItem(
                value: 'name',
                child: Row(
                  children: [
                    Icon(Icons.sort_by_alpha, size: 20),
                    SizedBox(width: 10),
                    Text('Name A-Z'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'price_high',
                child: Row(
                  children: [
                    Icon(Icons.arrow_downward, size: 20),
                    SizedBox(width: 10),
                    Text('Price: High to Low'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'price_low',
                child: Row(
                  children: [
                    Icon(Icons.arrow_upward, size: 20),
                    SizedBox(width: 10),
                    Text('Price: Low to High'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'quantity_low',
                child: Row(
                  children: [
                    Icon(Icons.warning, size: 20),
                    SizedBox(width: 10),
                    Text('Low Stock First'),
                  ],
                ),
              ),
              PopupMenuItem(
                value: 'recent',
                child: Row(
                  children: [
                    Icon(Icons.access_time, size: 20),
                    SizedBox(width: 10),
                    Text('Recently Updated'),
                  ],
                ),
              ),
            ],
            child: Container(
              padding: EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.grey[100],
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(Icons.sort, color: Colors.grey[700]),
            ),
          ),

          SizedBox(width: 10),

          // View Toggle
          Container(
            decoration: BoxDecoration(
              color: Colors.grey[100],
              borderRadius: BorderRadius.circular(10),
            ),
            child: Row(
              children: [
                IconButton(
                  onPressed: () {
                    setState(() {
                      _selectedView = 'grid';
                    });
                  },
                  icon: Icon(
                    Icons.grid_view,
                    color: _selectedView == 'grid'
                        ? Colors.blue[700]
                        : Colors.grey[500],
                    size: 20,
                  ),
                  padding: EdgeInsets.all(8),
                ),
                IconButton(
                  onPressed: () {
                    setState(() {
                      _selectedView = 'list';
                    });
                  },
                  icon: Icon(
                    Icons.list,
                    color: _selectedView == 'list'
                        ? Colors.blue[700]
                        : Colors.grey[500],
                    size: 22,
                  ),
                  padding: EdgeInsets.all(8),
                ),
              ],
            ),
          ),

          SizedBox(width: 10),

          // Low Stock Filter
          FilterChip(
            label: Text('Low Stock'),
            selected: provider.showOnlyLowStock,
            onSelected: (selected) {
              provider.toggleLowStockFilter(selected);
            },
            backgroundColor: Colors.grey[100],
            selectedColor: Colors.red[50],
            checkmarkColor: Colors.red,
            labelStyle: TextStyle(
              color: provider.showOnlyLowStock
                  ? Colors.red[700]
                  : Colors.grey[700],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation(Colors.blue[700]),
          ),
          SizedBox(height: 20),
          Text(
            'Loading products...',
            style: TextStyle(
              color: Colors.grey[600],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(ProductProvider provider) {
    // Custom empty state widget since the imported one doesn't exist
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory,
            size: 80,
            color: Colors.grey[300],
          ),
          SizedBox(height: 20),
          Text(
            provider.searchQuery.isNotEmpty
                ? 'No products match your search'
                : 'No Products Found',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: Colors.grey[600],
            ),
          ),
          SizedBox(height: 10),
          Text(
            provider.searchQuery.isNotEmpty
                ? 'Try a different search term'
                : 'Add your first product to get started',
            style: TextStyle(
              color: Colors.grey[500],
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: _navigateToAddProduct,
            icon: Icon(Icons.add),
            label: Text('Add Product'),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue[700],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildProductList(BuildContext context, ProductProvider provider, Size size) {
    final products = provider.products;

    return RefreshIndicator(
      onRefresh: () async {
        await provider.refresh();
      },
      color: Colors.blue[700],
      child: CustomScrollView(
        slivers: [
          // Product Count
          SliverToBoxAdapter(
            child: Padding(
              padding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
              child: Row(
                children: [
                  Text(
                    '${products.length} ${products.length == 1 ? 'product' : 'products'}',
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 14,
                    ),
                  ),
                  Spacer(),
                  if (provider.showOnlyLowStock)
                    Chip(
                      label: Text(
                        'Low Stock',
                        style: TextStyle(fontSize: 12),
                      ),
                      backgroundColor: Colors.red[50],
                      labelStyle: TextStyle(color: Colors.red[700]),
                      padding: EdgeInsets.symmetric(horizontal: 8),
                    ),
                ],
              ),
            ),
          ),

          // Products Grid/List - Using a simple container since ProductCard doesn't exist
          if (_selectedView == 'grid')
            SliverPadding(
              padding: EdgeInsets.symmetric(horizontal: 15),
              sliver: SliverGrid(
                gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: size.width > 600 ? 3 : 2,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 0.85,
                ),
                delegate: SliverChildBuilderDelegate(
                      (context, index) {
                    final product = products[index];
                    return _buildProductGridItem(product);
                  },
                  childCount: products.length,
                ),
              ),
            )
          else
            SliverList(
              delegate: SliverChildBuilderDelegate(
                    (context, index) {
                  final product = products[index];
                  return Padding(
                    padding: EdgeInsets.symmetric(horizontal: 15, vertical: 6),
                    child: _buildProductListItem(product),
                  );
                },
                childCount: products.length,
              ),
            ),

          // Bottom Padding
          SliverToBoxAdapter(
            child: SizedBox(height: 100),
          ),
        ],
      ),
    );
  }

  // Simple product grid item widget
  Widget _buildProductGridItem(Product product) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Product Image/Icon
            Container(
              height: 100,
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.inventory,
                size: 40,
                color: Colors.blue[300],
              ),
            ),
            SizedBox(height: 10),
            // Product Name
            Text(
              product.name,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
              ),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            SizedBox(height: 5),
            // Price and Stock
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  '\$${product.price.toStringAsFixed(2)}',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: Colors.blue[700],
                  ),
                ),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(
                    color: product.quantity <= 5 ? Colors.red[50] : Colors.green[50],
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${product.quantity} left',
                    style: TextStyle(
                      fontSize: 10,
                      color: product.quantity <= 5 ? Colors.red[700] : Colors.green[700],
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // Simple product list item widget
  Widget _buildProductListItem(Product product) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: Padding(
        padding: EdgeInsets.all(12),
        child: Row(
          children: [
            // Product Image/Icon
            Container(
              width: 60,
              height: 60,
              decoration: BoxDecoration(
                color: Colors.blue[50],
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(
                Icons.inventory,
                size: 30,
                color: Colors.blue[300],
              ),
            ),
            SizedBox(width: 12),
            // Product Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    product.name,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  SizedBox(height: 5),
                  Text(
                    product.category,
                    style: TextStyle(
                      color: Colors.grey[600],
                      fontSize: 12,
                    ),
                  ),
                  SizedBox(height: 5),
                  Row(
                    children: [
                      Text(
                        '\$${product.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.blue[700],
                        ),
                      ),
                      Spacer(),
                      Container(
                        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: product.quantity <= 5 ? Colors.red[50] : Colors.green[50],
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(
                          '${product.quantity} left',
                          style: TextStyle(
                            fontSize: 10,
                            color: product.quantity <= 5 ? Colors.red[700] : Colors.green[700],
                          ),
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  void _navigateToAddProduct() {
    // Using a placeholder since AddEditProductScreen doesn't exist
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Add Product'),
        content: Text('Add/Edit product screen will be implemented here.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _navigateToEditProduct(Product product) {
    // Using a placeholder since AddEditProductScreen doesn't exist
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Edit Product'),
        content: Text('Editing: ${product.name}\n\nAdd/Edit product screen will be implemented here.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('OK'),
          ),
        ],
      ),
    );
  }

  void _scanBarcode() {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Barcode scanning feature coming soon'),
        backgroundColor: Colors.blue[700],
      ),
    );
  }

  void _handleQuickAction(String action, Product product) async {
    final provider = Provider.of<ProductProvider>(context, listen: false);

    switch (action) {
      case 'restock':
        _showRestockDialog(product, provider);
        break;
      case 'sell':
        _showSellDialog(product, provider);
        break;
      case 'delete':
        _showDeleteDialog(product, provider);
        break;
      case 'duplicate':
        _duplicateProduct(product, provider);
        break;
    }
  }

  void _showRestockDialog(Product product, ProductProvider provider) {
    final quantityController = TextEditingController(text: '10');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Restock ${product.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Current stock: ${product.quantity}'),
            SizedBox(height: 15),
            TextField(
              controller: quantityController,
              decoration: InputDecoration(
                labelText: 'Quantity to add',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final quantity = int.tryParse(quantityController.text) ?? 0;
              if (quantity > 0) {
                final success = await provider.updateStock(
                  product.id!,
                  product.quantity + quantity,
                );
                if (context.mounted && success) { // Check mounted before using context
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Stock updated successfully'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              }
            },
            child: Text('Add Stock'),
          ),
        ],
      ),
    );
  }

  void _showSellDialog(Product product, ProductProvider provider) {
    final quantityController = TextEditingController(text: '1');

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Sell ${product.name}'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Available stock: ${product.quantity}'),
            SizedBox(height: 15),
            TextField(
              controller: quantityController,
              decoration: InputDecoration(
                labelText: 'Quantity to sell',
                border: OutlineInputBorder(),
              ),
              keyboardType: TextInputType.number,
            ),
            SizedBox(height: 10),
            Text(
              'Total: \$${(product.price * (int.tryParse(quantityController.text) ?? 1)).toStringAsFixed(2)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final quantity = int.tryParse(quantityController.text) ?? 0;
              if (quantity > 0 && quantity <= product.quantity) {
                final success = await provider.updateStock(
                  product.id!,
                  product.quantity - quantity,
                );
                if (context.mounted && success) { // Check mounted before using context
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text('Sale recorded successfully'),
                      backgroundColor: Colors.green,
                    ),
                  );
                }
              } else if (context.mounted) { // Check mounted before using context
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Invalid quantity'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            child: Text('Sell'),
          ),
        ],
      ),
    );
  }

  void _showDeleteDialog(Product product, ProductProvider provider) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Delete Product'),
        content: Text('Are you sure you want to delete "${product.name}"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () async {
              final success = await provider.deleteProduct(product.id!);
              if (context.mounted && success) { // Check mounted before using context
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('Product deleted successfully'),
                    backgroundColor: Colors.red,
                  ),
                );
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
            ),
            child: Text('Delete'),
          ),
        ],
      ),
    );
  }

  Future<void> _duplicateProduct(Product product, ProductProvider provider) async {
    final newProduct = product.copyWith(
      id: null,
      productId: null,
      sku: '${product.sku}_COPY',
      name: '${product.name} (Copy)',
      createdAt: DateTime.now(),
      updatedAt: DateTime.now(),
      isSynced: false,
    );

    final success = await provider.addProduct(newProduct);
    if (context.mounted && success) { // Check mounted before using context
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Product duplicated successfully'),
          backgroundColor: Colors.green,
        ),
      );
    }
  }
}