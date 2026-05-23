import 'package:firebase_auth/firebase_auth.dart' hide AuthProvider;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter/animation.dart';
import '../../providers/auth_provider.dart';

class SplashScreen extends StatefulWidget {
  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {

  late AnimationController _controller;
  late Animation<double> _scaleAnimation;
  late Animation<double> _fadeAnimation;
  late Animation<Offset> _slideAnimation;

  @override
  void initState() {
    super.initState();

    // Initialize animations
    _controller = AnimationController(
      vsync: this,
      duration: Duration(seconds: 2),
    );

    _scaleAnimation = Tween<double>(begin: 0.5, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );

    _fadeAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );

    _slideAnimation = Tween<Offset>(
      begin: Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    // Start animation
    _controller.forward();

    // Check auth status after animation
    _checkAuthStatus();
  }

  void _checkAuthStatus() async {
    await Future.delayed(Duration(seconds: 3));

    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    if (authProvider.isLoggedIn) {
      Navigator.pushReplacementNamed(context, '/dashboard');
    } else {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.blue[700],
      body: Center(
        child: AnimatedBuilder(
          animation: _controller,
          builder: (context, child) {
            return Opacity(
              opacity: _fadeAnimation.value,
              child: Transform.scale(
                scale: _scaleAnimation.value,
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    // Logo with bounce animation
                    SlideTransition(
                      position: _slideAnimation,
                      child: Container(
                        width: 120,
                        height: 120,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(25),
                          boxShadow: [
                            BoxShadow(
                              color: Colors.black.withOpacity(0.2),
                              blurRadius: 20,
                              spreadRadius: 5,
                            ),
                          ],
                        ),
                        child: Icon(
                          Icons.shopping_cart,
                          size: 70,
                          color: Colors.blue[700],
                        ),
                      ),
                    ),

                    SizedBox(height: 30),

                    // App Name with fade animation
                    FadeTransition(
                      opacity: _fadeAnimation,
                      child: Text(
                        'SMART POS',
                        style: TextStyle(
                          fontSize: 36,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                          letterSpacing: 2,
                        ),
                      ),
                    ),

                    SizedBox(height: 10),

                    // Tagline
                    FadeTransition(
                      opacity: _fadeAnimation,
                      child: Text(
                        'Professional POS System',
                        style: TextStyle(
                          fontSize: 16,
                          color: Colors.white70,
                          letterSpacing: 1,
                        ),
                      ),
                    ),

                    SizedBox(height: 40),

                    // Loading dots animation
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(3, (index) {
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 4),
                          child: Container(
                            width: 10,
                            height: 10,
                            decoration: BoxDecoration(
                              color: Colors.white
                                  .withOpacity(0.3 + (index * 0.2)),
                              shape: BoxShape.circle,
                            ),
                            child: ScaleTransition(
                              scale: _controller.drive(
                                CurveTween(
                                  curve: Interval(
                                    0.2 * index,
                                    0.2 * index + 0.5,
                                    curve: Curves.easeInOut,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        );
                      }),
                    ),

                    SizedBox(height: 20),

                    // Loading text
                    FadeTransition(
                      opacity: _fadeAnimation,
                      child: Text(
                        'Initializing System...',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white60,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}