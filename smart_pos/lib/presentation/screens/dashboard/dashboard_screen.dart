import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/animation.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/sidebar_menu.dart';

class DashboardScreen extends StatefulWidget {
  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen>
    with SingleTickerProviderStateMixin {

  late AnimationController _animationController;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;

  int _selectedIndex = 0;
  bool _isSidebarOpen = false;

  // List of screens for each menu item
  final List<Widget> _screens = [
    _buildHomeScreen(),
    _buildProductsScreen(),
    _buildSalesScreen(),
    _buildCustomersScreen(),
    _buildReportsScreen(),
    _buildBackupScreen(),
    _buildSettingsScreen(),
  ];

  // Screen titles for app bar
  final List<String> _screenTitles = [
    'Dashboard',
    'Products Management',
    'POS & Sales',
    'Customers',
    'Reports & Analytics',
    'Backup & Sync',
    'Settings',
  ];

  @override
  void initState() {
    super.initState();

    _animationController = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300),
    );

    _scaleAnimation = Tween<double>(begin: 0.95, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeOut,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeIn,
      ),
    );

    _animationController.forward();
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;

    // Define colors with null safety
    final primaryColor = Colors.blue[700]!;
    final primaryColorDark = Colors.blue[900]!;
    final grey50 = Colors.grey[50]!;
    final grey200 = Colors.grey[200]!;
    final grey500 = Colors.grey[500]!;
    final grey600 = Colors.grey[600]!;
    final grey700 = Colors.grey[700]!;
    final grey800 = Colors.grey[800]!;
    final blue100 = Colors.blue[100]!;
    final blue200 = Colors.blue[200]!;
    final blue600 = Colors.blue[600]!;
    final blue700 = Colors.blue[700]!;
    final blue900 = Colors.blue[900]!;
    final green200 = Colors.green[200]!;
    final green600 = Colors.green[600]!;
    final green700 = Colors.green[700]!;
    final orange200 = Colors.orange[200]!;
    final purple200 = Colors.purple[200]!;
    final teal200 = Colors.teal[200]!;

    return Scaffold(
      backgroundColor: grey50,
      body: AnimatedBuilder(
        animation: _animationController,
        builder: (context, child) {
          return Stack(
            children: [
              // Sidebar Menu
              Positioned(
                left: _isSidebarOpen ? 0 : -250,
                top: 0,
                bottom: 0,
                child: SidebarMenu(
                  user: user,
                  onItemSelected: (index) {
                    setState(() {
                      _selectedIndex = index;
                      _isSidebarOpen = false;
                    });
                  },
                  onSignOut: () async {
                    await authProvider.signOut();
                    if (context.mounted) {
                      Navigator.pushReplacementNamed(context, '/login');
                    }
                  },
                  currentIndex: _selectedIndex,
                ),
              ),

              // Main Content Area
              Transform.translate(
                offset: Offset(_isSidebarOpen ? 250 : 0, 0),
                child: Transform.scale(
                  scale: _isSidebarOpen ? 0.9 : _scaleAnimation.value,
                  child: Opacity(
                    opacity: _fadeAnimation.value,
                    child: Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: _isSidebarOpen
                            ? BorderRadius.circular(20)
                            : BorderRadius.zero,
                        boxShadow: _isSidebarOpen
                            ? [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.2),
                            blurRadius: 20,
                            spreadRadius: 5,
                          ),
                        ]
                            : [],
                      ),
                      child: Column(
                        children: [
                          // Top App Bar
                          _buildAppBar(context, user, primaryColor, primaryColorDark, grey700, green600, blue200, blue100, blue700),

                          // Main Content
                          Expanded(
                            child: Container(
                              padding: EdgeInsets.all(20),
                              child: _screens[_selectedIndex],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ],
          );
        },
      ),

      // Bottom Navigation (Mobile View)
      bottomNavigationBar: MediaQuery.of(context).size.width < 768
          ? _buildBottomNavigationBar(primaryColor, grey500)
          : null,
    );
  }

  // App Bar Widget
  Widget _buildAppBar(BuildContext context, User? user, Color primaryColor,
      Color primaryColorDark, Color grey700, Color green600, Color blue200,
      Color blue100, Color blue700) {
    return Container(
      height: 70,
      padding: EdgeInsets.symmetric(horizontal: 20),
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
      child: Row(
        children: [
          // Menu Button
          IconButton(
            onPressed: () {
              setState(() {
                _isSidebarOpen = !_isSidebarOpen;
              });
            },
            icon: Icon(
              Icons.menu,
              color: primaryColor,
              size: 28,
            ),
          ),

          SizedBox(width: 15),

          // Screen Title
          Expanded(
            child: Text(
              _screenTitles[_selectedIndex],
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: primaryColorDark,
              ),
              overflow: TextOverflow.ellipsis,
            ),
          ),

          // Right side icons and user info
          Row(
            children: [
              // Notification Bell with Badge
              Stack(
                children: [
                  IconButton(
                    onPressed: () {
                      _showNotifications(context, blue100);
                    },
                    icon: Icon(
                      Icons.notifications_none,
                      color: grey700,
                      size: 26,
                    ),
                  ),
                  Positioned(
                    right: 8,
                    top: 8,
                    child: Container(
                      padding: EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        shape: BoxShape.circle,
                      ),
                      constraints: BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '3',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
                ],
              ),

              // Sync Status Indicator
              IconButton(
                onPressed: () {
                  _showSyncStatus(context);
                },
                icon: Icon(
                  Icons.cloud_sync,
                  color: green600,
                  size: 26,
                ),
              ),

              SizedBox(width: 10),

              // User Profile
              GestureDetector(
                onTap: () {
                  _showUserProfile(context, user, blue100, blue700);
                },
                child: Container(
                  padding: EdgeInsets.all(2),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: blue200,
                      width: 2,
                    ),
                  ),
                  child: CircleAvatar(
                    radius: 20,
                    backgroundColor: blue100,
                    backgroundImage: user?.photoURL != null
                        ? NetworkImage(user!.photoURL!)
                        : null,
                    child: user?.photoURL == null
                        ? Icon(
                      Icons.person,
                      color: blue700,
                      size: 22,
                    )
                        : null,
                  ),
                ),
              ),

              SizedBox(width: 10),

              // User Info (Only on larger screens)
              if (MediaQuery.of(context).size.width > 600)
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      user?.displayName?.split(' ').first ?? 'User',
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        fontSize: 14,
                      ),
                    ),
                    Text(
                      'Admin',
                      style: TextStyle(
                        fontSize: 12,
                        color: green600,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
            ],
          ),
        ],
      ),
    );
  }

  // Bottom Navigation Bar (for mobile)
  Widget _buildBottomNavigationBar(Color primaryColor, Color grey500) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(15),
          topRight: Radius.circular(15),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(Icons.dashboard, 'Home', 0, primaryColor, grey500),
          _buildNavItem(Icons.inventory, 'Products', 1, primaryColor, grey500),
          _buildNavItem(Icons.point_of_sale, 'POS', 2, primaryColor, grey500),
          _buildNavItem(Icons.people, 'Customers', 3, primaryColor, grey500),
          _buildNavItem(Icons.more_horiz, 'More', 4, primaryColor, grey500),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, int index, Color primaryColor, Color grey500) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedIndex = index;
        });
      },
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            icon,
            color: _selectedIndex == index
                ? primaryColor
                : grey500,
            size: 24,
          ),
          SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              color: _selectedIndex == index
                  ? primaryColor
                  : grey500,
              fontWeight: _selectedIndex == index
                  ? FontWeight.bold
                  : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  // ============================================
  // SCREEN BUILDERS
  // ============================================

  // 1. Home/Dashboard Screen
  static Widget _buildHomeScreen() {
    // Define colors for home screen
    final blue700 = Colors.blue[700]!;
    final blue900 = Colors.blue[900]!;
    final blue100 = Colors.blue[100]!;
    final blue600 = Colors.blue[600]!;
    final grey50 = Colors.grey[50]!;
    final grey200 = Colors.grey[200]!;
    final grey600 = Colors.grey[600]!;
    final grey800 = Colors.grey[800]!;
    final green700 = Colors.green[700]!;

    return SingleChildScrollView(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Welcome Card with Stats
          Container(
            padding: EdgeInsets.all(25),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [blue700, blue900],
              ),
              borderRadius: BorderRadius.circular(20),
              boxShadow: [
                BoxShadow(
                  color: Colors.blue.withOpacity(0.3),
                  blurRadius: 20,
                  spreadRadius: 5,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    CircleAvatar(
                      backgroundColor: Colors.white.withOpacity(0.2),
                      child: Icon(Icons.shopping_cart, color: Colors.white),
                    ),
                    SizedBox(width: 15),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Welcome to Smart POS',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                          Text(
                            'Everything you need to manage your business',
                            style: TextStyle(
                              fontSize: 14,
                              color: Colors.white.withOpacity(0.9),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 20),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton.icon(
                        onPressed: () {},
                        icon: Icon(Icons.add, size: 20),
                        label: Text('New Sale'),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: blue700,
                          padding: EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),
                    SizedBox(width: 10),
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () {},
                        icon: Icon(Icons.analytics, size: 20),
                        label: Text('View Stats'),
                        style: OutlinedButton.styleFrom(
                          side: BorderSide(color: Colors.white),
                          foregroundColor: Colors.white,
                          padding: EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),

          SizedBox(height: 25),

          // Quick Stats Section
          Text(
            'Business Overview',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: grey800,
            ),
          ),

          SizedBox(height: 15),

          GridView.count(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            crossAxisSpacing: 15,
            mainAxisSpacing: 15,
            children: [
              _buildStatCard(
                title: 'Today\'s Sales',
                value: '\$2,540',
                icon: Icons.attach_money,
                color: Colors.green,
                change: '+12%',
                grey800: grey800,
                grey600: grey600,
              ),
              _buildStatCard(
                title: 'Total Products',
                value: '156',
                icon: Icons.inventory,
                color: Colors.blue,
                change: '+8%',
                grey800: grey800,
                grey600: grey600,
              ),
              _buildStatCard(
                title: 'Customers',
                value: '48',
                icon: Icons.people,
                color: Colors.orange,
                change: '+15%',
                grey800: grey800,
                grey600: grey600,
              ),
              _buildStatCard(
                title: 'Low Stock Items',
                value: '12',
                icon: Icons.warning,
                color: Colors.red,
                change: '+3',
                grey800: grey800,
                grey600: grey600,
              ),
            ],
          ),

          SizedBox(height: 25),

          // Recent Activity Section
          Row(
            children: [
              Expanded(
                child: Text(
                  'Recent Sales',
                  style: TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                    color: grey800,
                  ),
                ),
              ),
              TextButton(
                onPressed: () {},
                child: Row(
                  children: [
                    Text('View All'),
                    SizedBox(width: 5),
                    Icon(Icons.arrow_forward, size: 16),
                  ],
                ),
              ),
            ],
          ),

          Container(
            padding: EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(15),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.05),
                  blurRadius: 10,
                  spreadRadius: 1,
                ),
              ],
            ),
            child: Column(
              children: List.generate(4, (index) => _buildSaleItem(index, blue100, blue600, blue700, grey600, green700, grey200)),
            ),
          ),

          SizedBox(height: 25),

          // Quick Actions
          Text(
            'Quick Actions',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: grey800,
            ),
          ),

          SizedBox(height: 15),

          GridView.count(
            shrinkWrap: true,
            physics: NeverScrollableScrollPhysics(),
            crossAxisCount: 4,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.2,
            children: [
              _buildQuickAction(Icons.add, 'Add Product', Colors.blue, grey800),
              _buildQuickAction(Icons.receipt, 'New Invoice', Colors.green, grey800),
              _buildQuickAction(Icons.person_add, 'Add Customer', Colors.orange, grey800),
              _buildQuickAction(Icons.backup, 'Backup Now', Colors.purple, grey800),
              _buildQuickAction(Icons.print, 'Print Report', Colors.teal, grey800),
              _buildQuickAction(Icons.qr_code, 'Scan Barcode', Colors.indigo, grey800),
              _buildQuickAction(Icons.history, 'View History', Colors.brown, grey800),
              _buildQuickAction(Icons.settings, 'Settings', Colors.grey, grey800),
            ],
          ),
        ],
      ),
    );
  }

  // 2. Products Screen
  static Widget _buildProductsScreen() {
    final blue200 = Colors.blue[200]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.inventory,
            size: 100,
            color: blue200,
          ),
          SizedBox(height: 20),
          Text(
            'Products Management',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Add, edit, delete and manage your products',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.add),
            label: Text('Add New Product'),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            ),
          ),
        ],
      ),
    );
  }

  // 3. Sales/POS Screen
  static Widget _buildSalesScreen() {
    final green200 = Colors.green[200]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.point_of_sale,
            size: 100,
            color: green200,
          ),
          SizedBox(height: 20),
          Text(
            'POS System',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Process sales, manage cart and checkout',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.shopping_cart),
            label: Text('Start New Sale'),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            ),
          ),
        ],
      ),
    );
  }

  // 4. Customers Screen
  static Widget _buildCustomersScreen() {
    final orange200 = Colors.orange[200]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.people,
            size: 100,
            color: orange200,
          ),
          SizedBox(height: 20),
          Text(
            'Customer Management',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Manage customer information and purchase history',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.person_add),
            label: Text('Add New Customer'),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            ),
          ),
        ],
      ),
    );
  }

  // 5. Reports Screen
  static Widget _buildReportsScreen() {
    final purple200 = Colors.purple[200]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.analytics,
            size: 100,
            color: purple200,
          ),
          SizedBox(height: 20),
          Text(
            'Reports & Analytics',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'View sales, inventory and financial reports',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              ElevatedButton.icon(
                onPressed: () {},
                icon: Icon(Icons.insert_chart),
                label: Text('Sales Report'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
              ),
              SizedBox(width: 10),
              ElevatedButton.icon(
                onPressed: () {},
                icon: Icon(Icons.inventory),
                label: Text('Stock Report'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 6. Backup Screen
  static Widget _buildBackupScreen() {
    final teal200 = Colors.teal[200]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.cloud,
            size: 100,
            color: teal200,
          ),
          SizedBox(height: 20),
          Text(
            'Backup & Sync',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Backup data to cloud and sync across devices',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          Column(
            children: [
              ElevatedButton.icon(
                onPressed: () {},
                icon: Icon(Icons.backup),
                label: Text('Backup to Cloud'),
                style: ElevatedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                  minimumSize: Size(250, 50),
                ),
              ),
              SizedBox(height: 15),
              OutlinedButton.icon(
                onPressed: () {},
                icon: Icon(Icons.sync),
                label: Text('Sync Now'),
                style: OutlinedButton.styleFrom(
                  padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
                  minimumSize: Size(250, 50),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // 7. Settings Screen
  static Widget _buildSettingsScreen() {
    final grey400 = Colors.grey[400]!;
    final grey700 = Colors.grey[700]!;
    final grey600 = Colors.grey[600]!;

    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(
            Icons.settings,
            size: 100,
            color: grey400,
          ),
          SizedBox(height: 20),
          Text(
            'Settings',
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.bold,
              color: grey700,
            ),
          ),
          SizedBox(height: 10),
          Text(
            'Configure app settings and preferences',
            style: TextStyle(
              fontSize: 16,
              color: grey600,
            ),
            textAlign: TextAlign.center,
          ),
          SizedBox(height: 30),
          ElevatedButton.icon(
            onPressed: () {},
            icon: Icon(Icons.settings_applications),
            label: Text('Open Settings'),
            style: ElevatedButton.styleFrom(
              padding: EdgeInsets.symmetric(horizontal: 30, vertical: 15),
            ),
          ),
        ],
      ),
    );
  }

  // ============================================
  // HELPER WIDGETS
  // ============================================

  // Stat Card Widget
  static Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
    required String change,
    required Color grey800,
    required Color grey600,
  }) {
    return Container(
      padding: EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            spreadRadius: 1,
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              Spacer(),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: change.startsWith('+')
                      ? Colors.green.withOpacity(0.1)
                      : Colors.red.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(
                  change,
                  style: TextStyle(
                    color: change.startsWith('+')
                        ? Colors.green
                        : Colors.red,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
          SizedBox(height: 20),
          Text(
            value,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.bold,
              color: grey800,
            ),
          ),
          SizedBox(height: 5),
          Text(
            title,
            style: TextStyle(
              fontSize: 14,
              color: grey600,
            ),
          ),
        ],
      ),
    );
  }

  // Sale Item Widget
  static Widget _buildSaleItem(int index, Color blue100, Color blue600, Color blue700,
      Color grey600, Color green700, Color grey200) {
    final List<Map<String, dynamic>> sales = [
      {
        'id': '#001',
        'customer': 'John Doe',
        'amount': 120.50,
        'items': 3,
        'time': '10:30 AM',
        'status': 'Completed',
        'statusColor': Colors.green,
      },
      {
        'id': '#002',
        'customer': 'Jane Smith',
        'amount': 85.25,
        'items': 2,
        'time': '11:15 AM',
        'status': 'Completed',
        'statusColor': Colors.green,
      },
      {
        'id': '#003',
        'customer': 'Mike Johnson',
        'amount': 45.99,
        'items': 1,
        'time': '12:45 PM',
        'status': 'Pending',
        'statusColor': Colors.orange,
      },
      {
        'id': '#004',
        'customer': 'Sarah Wilson',
        'amount': 230.75,
        'items': 5,
        'time': '2:30 PM',
        'status': 'Completed',
        'statusColor': Colors.green,
      },
    ];

    final sale = sales[index];

    return Container(
      margin: EdgeInsets.only(bottom: 15),
      padding: EdgeInsets.all(15),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: grey200),
      ),
      child: Row(
        children: [
          // Sale ID Badge
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: blue100,
              borderRadius: BorderRadius.circular(10),
            ),
            child: Center(
              child: Text(
                sale['id'].replaceAll('#', ''),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 16,
                  color: blue700,
                ),
              ),
            ),
          ),

          SizedBox(width: 15),

          // Sale Details
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        sale['customer'],
                        style: TextStyle(
                          fontWeight: FontWeight.w600,
                          fontSize: 16,
                        ),
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    Container(
                      padding: EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: (sale['statusColor'] as Color).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: Text(
                        sale['status'],
                        style: TextStyle(
                          fontSize: 11,
                          color: sale['statusColor'],
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),

                SizedBox(height: 5),

                Text(
                  '${sale['items']} items • ${sale['time']}',
                  style: TextStyle(
                    fontSize: 13,
                    color: grey600,
                  ),
                ),
              ],
            ),
          ),

          SizedBox(width: 15),

          // Sale Amount
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '\$${sale['amount']}',
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: green700,
                ),
              ),
              SizedBox(height: 5),
              IconButton(
                onPressed: () {},
                icon: Icon(
                  Icons.receipt,
                  size: 20,
                  color: blue600,
                ),
                padding: EdgeInsets.zero,
                constraints: BoxConstraints(),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // Quick Action Widget
  static Widget _buildQuickAction(IconData icon, String label, Color color, Color grey800) {
    return GestureDetector(
      onTap: () {},
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 5,
              spreadRadius: 1,
            ),
          ],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            SizedBox(height: 8),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                color: grey800,
                fontWeight: FontWeight.w500,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  // ============================================
  // DIALOGS AND MODALS
  // ============================================

  void _showNotifications(BuildContext context, Color blue100) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Notifications'),
        content: Container(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _buildNotificationItem('Low stock alert: Product A', '10 min ago', blue100),
              _buildNotificationItem('New sale recorded', '1 hour ago', blue100),
              _buildNotificationItem('Backup completed', '2 hours ago', blue100),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Clear All'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }

  Widget _buildNotificationItem(String text, String time, Color blue100) {
    return ListTile(
      leading: CircleAvatar(
        backgroundColor: blue100,
        child: Icon(Icons.notifications, size: 20, color: Colors.blue),
      ),
      title: Text(text),
      subtitle: Text(time),
      trailing: Icon(Icons.chevron_right, size: 16),
    );
  }

  void _showSyncStatus(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Sync Status'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.check_circle, size: 50, color: Colors.green),
            SizedBox(height: 15),
            Text('Last sync: Today, 10:30 AM'),
            SizedBox(height: 10),
            Text('All data is synchronized'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Sync Now'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Close'),
          ),
        ],
      ),
    );
  }

  void _showUserProfile(BuildContext context, User? user, Color blue100, Color blue700) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            CircleAvatar(
              radius: 40,
              backgroundColor: blue100,
              backgroundImage: user?.photoURL != null
                  ? NetworkImage(user!.photoURL!)
                  : null,
              child: user?.photoURL == null
                  ? Icon(Icons.person, size: 40, color: blue700)
                  : null,
            ),
            SizedBox(height: 15),
            Text(
              user?.displayName ?? 'POS User',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            Text(
              user?.email ?? 'user@pos.com',
              style: TextStyle(color: Colors.grey),
            ),
            SizedBox(height: 20),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {},
                    child: Text('Edit Profile'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}