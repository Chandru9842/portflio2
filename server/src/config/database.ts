import mongoose from 'mongoose';

/**
 * Validates that the MONGODB_URI environment variable is configured and in a valid format.
 * Throws a detailed error with manual configuration instructions if validation fails.
 */
export function validateDatabaseConfig(): string {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    throw new Error(
      `\n==========================================================================\n` +
      `❌ CRITICAL CONFIGURATION ERROR: MONGODB_URI IS MISSING OR EMPTY!\n` +
      `==========================================================================\n` +
      `Please configure your MongoDB Atlas connection string manually:\n\n` +
      `Option A: Add to your local '.env' file in the root directory:\n` +
      `MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority\n\n` +
      `Option B: If running on AI Studio Build platform:\n` +
      `1. Open the 'Settings' panel in the AI Studio UI.\n` +
      `2. Go to 'Environment Variables' / 'Secrets'.\n` +
      `3. Add 'MONGODB_URI' with your MongoDB Atlas connection string.\n` +
      `4. Save to restart the development environment.\n` +
      `==========================================================================\n`
    );
  }

  const trimmedUri = uri.trim();
  if (!trimmedUri.startsWith('mongodb+srv://') && !trimmedUri.startsWith('mongodb://')) {
    throw new Error(
      `\n==========================================================================\n` +
      `❌ CRITICAL CONFIGURATION ERROR: INVALID MONGODB_URI FORMAT!\n` +
      `==========================================================================\n` +
      `Your MONGODB_URI does not have a valid prefix. It must start with:\n` +
      `- 'mongodb+srv://' (for MongoDB Atlas SRV connection strings)\n` +
      `- 'mongodb://' (for standard MongoDB connection strings)\n\n` +
      `Please double check your configuration in the '.env' file or Settings.\n` +
      `==========================================================================\n`
    );
  }

  return trimmedUri;
}

/**
 * Connects to MongoDB after validating the configuration.
 */
export async function connectDB(): Promise<void> {
  const uri = validateDatabaseConfig();

  try {
    // Configure mongoose options
    mongoose.set('strictQuery', true);
    // Disable command buffering globally so queries fail-fast rather than hanging if disconnected
    mongoose.set('bufferCommands', false);

    console.log('🔄 Attempting to connect to MongoDB Atlas...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Fail-fast after 5 seconds instead of 30 seconds
    });
    console.log('✅ MongoDB connected successfully.');
    
    // Auto-create all collections if they don't exist
    await ensureCollectionsExist();
  } catch (error: any) {
    console.error('❌ MongoDB Connection Error:', error?.message || error);
    throw error;
  }
}

/**
 * Iterates through all declared schemas and auto-creates their database collections on connection.
 */
export async function ensureCollectionsExist(): Promise<void> {
  try {
    const models = await import('../models');
    console.log('🔄 Ensuring all database collections are initialized...');
    for (const key of Object.keys(models)) {
      const Model = (models as any)[key];
      if (Model && typeof Model.createCollection === 'function') {
        try {
          await Model.createCollection();
          console.log(`  📁 Collection initialized for model: ${key}`);
        } catch (err: any) {
          console.warn(`  ⚠️  Collection creation for ${key} returned:`, err.message || err);
        }
      }
    }
    console.log('✅ All collections verified.');
  } catch (importErr: any) {
    console.warn('⚠️  Could not dynamically import models to ensure collections exist:', importErr.message || importErr);
  }
}

// Watch connection state changes
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected.');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB runtime error:', err);
});
