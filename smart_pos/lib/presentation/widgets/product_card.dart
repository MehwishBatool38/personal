import 'package:flutter/material.dart';
import '../../data/models/product_model.dart';

class ProductCard extends StatelessWidget {
  final Product product;
  final String viewType; // 'grid' or 'list'
  final VoidCallback onTap;
  final Function(String) onQuickAction;

  const ProductCard({
    Key? key,
    required this.product,
    required this.viewType,
    required this.onTap,
    required this.onQuickAction,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (viewType == 'grid') {
      return _buildGridCard(context);
    } else {
      return _buildListCard(context);
    }
  }

  Widget _buildGridCard(BuildContext context) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
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
                  image: product.imageUrl != null
                      ? DecorationImage(
                    image: NetworkImage(product.imageUrl!),
                    fit: BoxFit.cover,
                  )
                      : null,
                ),
                child: product.imageUrl == null
                    ? Center(
                  child: Icon(
                    Icons.inventory,
                    size: 40,
                    color: Colors.blue[200],
                  ),
                )
                    : null,
              ),

              SizedBox(height: 10),

              // Product Name
              Text(
                product.name,
                style: TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 14,
                  color: Colors.grey[800],
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              // SKU
              Text(
                product.sku,
                style: TextStyle(
                  fontSize: 11,
                  color: Colors.grey[600],
                ),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),

              Spacer(),

              // Price and Stock
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '\$${product.price.toStringAsFixed(2)}',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Colors.green[700],
                        ),
                      ),
                      Text(
                        'Stock: ${product.quantity}',
                        style: TextStyle(
                          fontSize: 12,
                          color: product.isLowStock ? Colors.red : Colors.grey[600],
                          fontWeight: product.isLowStock ? FontWeight.bold : FontWeight.normal,
                        ),
                      ),
                    ],
                  ),

                  // Quick Action Menu
                  PopupMenuButton<String>(
                    onSelected: (value) => onQuickAction(value),
                    itemBuilder: (BuildContext context) => [
                      PopupMenuItem(
                        value: 'restock',
                        child: Row(
                          children: [
                            Icon(Icons.add, size: 18, color: Colors.blue),
                            SizedBox(width: 8),
                            Text('Restock'),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'sell',
                        child: Row(
                          children: [
                            Icon(Icons.shopping_cart, size: 18, color: Colors.green),
                            SizedBox(width: 8),
                            Text('Sell'),
                          ],
                        ),
                      ),
                      PopupMenuItem(
                        value: 'duplicate',
                        child: Row(
                          children: [
                            Icon(Icons.copy, size: 18, color: Colors.orange),
                            SizedBox(width: 8),
                            Text('Duplicate'),
                          ],
                        ),
                      ),
                      PopupMenuDivider(),
                      PopupMenuItem(
                        value: 'delete',
                        child: Row(
                          children: [
                            Icon(Icons.delete, size: 18, color: Colors.red),
                            SizedBox(width: 8),
                            Text('Delete'),
                          ],
                        ),
                      ),
                    ],
                    child: Container(
                      padding: EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: Colors.grey[100],
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.more_vert,
                        size: 16,
                        color: Colors.grey[600],
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildListCard(BuildContext context) {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: EdgeInsets.all(15),
          child: Row(
            children: [
              // Product Image/Icon
              Container(
                width: 60,
                height: 60,
                decoration: BoxDecoration(
                  color: Colors.blue[50],
                  borderRadius: BorderRadius.circular(8),
                  image: product.imageUrl != null
                      ? DecorationImage(
                    image: NetworkImage(product.imageUrl!),
                    fit: BoxFit.cover,
                  )
                      : null,
                ),
                child: product.imageUrl == null
                    ? Center(
                  child: Icon(
                    Icons.inventory,
                    size: 30,
                    color: Colors.blue[200],
                  ),
                )
                    : null,
              ),

              SizedBox(width: 15),

              // Product Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            product.name,
                            style: TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 16,
                              color: Colors.grey[800],
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        if (product.isLowStock)
                          Container(
                            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                            decoration: BoxDecoration(
                              color: Colors.red[50],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'LOW',
                              style: TextStyle(
                                fontSize: 10,
                                color: Colors.red[700],
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                      ],
                    ),

                    SizedBox(height: 5),

                    Text(
                      product.sku,
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                    ),

                    SizedBox(height: 5),

                    Row(
                      children: [
                        Text(
                          'Stock: ',
                          style: TextStyle(
                            fontSize: 12,
                            color: Colors.grey[600],
                          ),
                        ),
                        Text(
                          '${product.quantity} ${product.unit}',
                          style: TextStyle(
                            fontSize: 12,
                            color: product.isLowStock ? Colors.red : Colors.green[600],
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),

              SizedBox(width: 15),

              // Price and Actions
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text(
                    '\$${product.price.toStringAsFixed(2)}',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 18,
                      color: Colors.green[700],
                    ),
                  ),

                  SizedBox(height: 8),

                  Row(
                    children: [
                      // Quick Sell Button
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: Colors.green[50],
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          onPressed: () => onQuickAction('sell'),
                          icon: Icon(
                            Icons.shopping_cart,
                            size: 14,
                            color: Colors.green[700],
                          ),
                          padding: EdgeInsets.zero,
                        ),
                      ),

                      SizedBox(width: 8),

                      // More Options
                      Container(
                        width: 30,
                        height: 30,
                        decoration: BoxDecoration(
                          color: Colors.grey[100],
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          onPressed: () {
                            showModalBottomSheet(
                              context: context,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.vertical(
                                  top: Radius.circular(20),
                                ),
                              ),
                              builder: (BuildContext sheetContext) => _buildQuickActionsSheet(sheetContext),
                            );
                          },
                          icon: Icon(
                            Icons.more_horiz,
                            size: 16,
                            color: Colors.grey[600],
                          ),
                          padding: EdgeInsets.zero,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildQuickActionsSheet(BuildContext sheetContext) {
    return Container(
      padding: EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(
            product.name,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
            ),
            textAlign: TextAlign.center,
          ),

          SizedBox(height: 10),

          Text(
            product.sku,
            style: TextStyle(
              fontSize: 14,
              color: Colors.grey[600],
            ),
          ),

          SizedBox(height: 20),

          GridView.count(
            shrinkWrap: true,
            crossAxisCount: 3,
            crossAxisSpacing: 15,
            mainAxisSpacing: 15,
            childAspectRatio: 1.2,
            children: [
              _buildActionButton(
                context: sheetContext,
                icon: Icons.add,
                label: 'Restock',
                color: Colors.blue,
                action: 'restock',
              ),
              _buildActionButton(
                context: sheetContext,
                icon: Icons.shopping_cart,
                label: 'Sell',
                color: Colors.green,
                action: 'sell',
              ),
              _buildActionButton(
                context: sheetContext,
                icon: Icons.edit,
                label: 'Edit',
                color: Colors.orange,
                action: 'edit',
              ),
              _buildActionButton(
                context: sheetContext,
                icon: Icons.copy,
                label: 'Duplicate',
                color: Colors.purple,
                action: 'duplicate',
              ),
              _buildActionButton(
                context: sheetContext,
                icon: Icons.qr_code,
                label: 'Barcode',
                color: Colors.teal,
                action: 'barcode',
              ),
              _buildActionButton(
                context: sheetContext,
                icon: Icons.delete,
                label: 'Delete',
                color: Colors.red,
                action: 'delete',
              ),
            ],
          ),

          SizedBox(height: 20),

          ElevatedButton(
            onPressed: () => Navigator.pop(sheetContext),
            style: ElevatedButton.styleFrom(
              minimumSize: Size(double.infinity, 50),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton({
    required BuildContext context,
    required IconData icon,
    required String label,
    required Color color,
    required String action,
  }) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context); // Close bottom sheet
        onQuickAction(action);
      },
      child: Container(
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, color: color, size: 24),
            SizedBox(height: 5),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}