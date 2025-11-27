import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Controls from './components/Controls';
import { EnhancementOptions, PlantOption, LightingOption, ResolutionOption, KitchenFinish, WoodTextureOption, DecorIntensity, PerspectiveType, LightingAtmosphere, FurnitureAddOption } from './types';
import { enhanceKitchenImage, fileToGenerativePart } from './services/geminiService';
import { Upload, AlertCircle, Download, Maximize2, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [options, setOptions] = useState<EnhancementOptions>({
    plants: PlantOption.NONE,
    wallDecor: false,
    utensils: false,
    fruit: false,
    lighting: LightingOption.NO_CHANGE,
    lightingIntensity: 50,
    resolution: ResolutionOption.MEDIUM,
    raytracing: false,
    addWindowView: false,
    kitchenFinish: KitchenFinish.AUTO,
    woodTexture: WoodTextureOption.STANDARD,
    enhanceFramedDoors: false,
    highFidelityDetails: false,
    hyperRealism: false,
    allowWallModification: false,
    allowFloorModification: false,
    addWalls: false,
    decorIntensity: DecorIntensity.MINIMAL,
    perspectiveType: PerspectiveType.NATURAL,
    lightingAtmosphere: LightingAtmosphere.NEUTRAL,
    furnitureAdd: FurnitureAddOption.NONE,
  });

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setError(null);
      setGeneratedImage(null); // Reset previous result

      // Create preview URL
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) return;

    setIsGenerating(true);
    setError(null);

    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const resultBase64 = await enhanceKitchenImage(base64Data, options);
      setGeneratedImage(`data:image/jpeg;base64,${resultBase64}`);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue lors de la génération.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-900 bg-gray-50">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8">
        
        {/* API Key Warning for Demo */}
        {!process.env.API_KEY && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  Clé API manquante. L'application ne fonctionnera pas sans définir process.env.API_KEY.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Controls 
              options={options} 
              setOptions={setOptions} 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
              hasImage={!!selectedFile}
            />
          </div>

          {/* Visual Workspace */}
          <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
            
            {/* Upload Area (If no image selected) */}
            {!previewUrl && (
              <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 flex flex-col items-center justify-center text-center h-[500px] hover:bg-gray-50 transition-colors">
                <div className="bg-blue-50 p-4 rounded-full mb-4">
                  <Upload className="h-10 w-10 text-ixina-blue" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Importez votre photo</h3>
                <p className="mt-1 text-sm text-gray-500">PNG, JPG jusqu'à 10MB</p>
                <div className="mt-6">
                  <label htmlFor="file-upload" className="cursor-pointer bg-ixina-blue text-white py-2 px-6 rounded-md hover:bg-blue-700 transition font-medium shadow-sm">
                    Sélectionner un fichier
                  </label>
                  <input 
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            )}

            {/* Display Area */}
            {previewUrl && (
              <div className="space-y-6">
                
                {/* Comparison Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original */}
                  <div className="flex flex-col gap-3">
                    <div className="relative group">
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10">
                        ORIGINAL
                      </div>
                      <div className="aspect-[4/3] bg-gray-200 rounded-lg overflow-hidden border border-gray-200 relative">
                        <img 
                          src={previewUrl} 
                          alt="Original" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Main Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={handleGenerate}
                        disabled={!selectedFile || isGenerating}
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-md transition-all transform flex items-center justify-center gap-2
                          ${!selectedFile || isGenerating 
                            ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                            : 'bg-gradient-to-r from-ixina-blue to-blue-600 hover:scale-[1.02] hover:shadow-lg'
                          }`}
                      >
                        {isGenerating ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Traitement...
                          </>
                        ) : (
                          <>
                            <Zap size={18} />
                            GÉNÉRER LE RENDU
                          </>
                        )}
                      </button>

                      <label 
                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 hover:border-ixina-blue hover:text-ixina-blue hover:bg-blue-50 cursor-pointer transition-all"
                      >
                        <Upload size={16} />
                        CHANGER LA PHOTO
                        <input 
                          type="file" 
                          className="sr-only" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Result */}
                  <div className="flex flex-col gap-3">
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-ixina-blue text-white text-xs px-2 py-1 rounded backdrop-blur-sm z-10 font-bold tracking-wider flex items-center gap-1">
                        {isGenerating ? 'EN TRAITEMENT...' : 'RENDU MAN CREATOR'}
                      </div>
                      
                      <div className={`aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden border border-gray-200 relative flex items-center justify-center ${isGenerating ? 'animate-pulse' : ''}`}>
                        {generatedImage ? (
                          <img 
                            src={generatedImage} 
                            alt="Enhanced" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-6">
                            {isGenerating ? (
                              <div className="flex flex-col items-center gap-4">
                                  <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
                                  <p className="text-gray-300 text-sm">Le moteur temporel s'active...</p>
                              </div>
                            ) : (
                              <div className="text-gray-500 flex flex-col items-center">
                                <Maximize2 className="w-12 h-12 mb-2 opacity-20" />
                                <p className="text-sm">Le rendu apparaîtra ici</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Download Button */}
                    {generatedImage ? (
                       <a 
                        href={generatedImage} 
                        download="ixina-enhanced-render.jpg"
                        className="flex items-center justify-center gap-2 w-full py-3.5 bg-ixina-blue text-white rounded-lg shadow-sm text-sm font-bold hover:bg-blue-700 transition-all mt-auto"
                      >
                        <Download size={16} />
                        TÉLÉCHARGER LE RENDU
                      </a>
                    ) : (
                      <div className="h-[52px] border border-transparent"></div> /* Spacer for alignment matching Generate button height */
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quote / Footer Detail */}
            <div className="text-center pt-8 opacity-50">
               <p className="text-xs font-mono text-gray-500">
                "Là où on va, on n'a pas besoin de route... mais on a besoin d'une belle cuisine."
               </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;