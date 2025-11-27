

import React from 'react';
import { EnhancementOptions, PlantOption, LightingOption, ResolutionOption, KitchenFinish, WoodTextureOption, DecorIntensity, PerspectiveType, LightingAtmosphere, FurnitureAddOption } from '../types';
import { Leaf, Image as ImageIcon, Utensils, Zap, Lightbulb, Sun, Monitor, Sparkles, AppWindow, Layers, Aperture, Droplets, ScanFace, PaintBucket, Coffee, Camera, Grid, Sunset, Moon, Diamond, Grid2X2, TreeDeciduous, Armchair, BrickWall } from 'lucide-react';

interface ControlsProps {
  options: EnhancementOptions;
  setOptions: React.Dispatch<React.SetStateAction<EnhancementOptions>>;
  onGenerate: () => void;
  isGenerating: boolean;
  hasImage: boolean;
}

const Controls: React.FC<ControlsProps> = ({ 
  options, 
  setOptions, 
  onGenerate, 
  isGenerating,
  hasImage 
}) => {
  
  const handleChange = <K extends keyof EnhancementOptions>(key: K, value: EnhancementOptions[K]) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity < 30) return 'Douce';
    if (intensity < 70) return 'Équilibrée';
    return 'Intense';
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-2">
          <span className="bg-ixina-blue text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
          Personnalisation
        </h2>
        <p className="text-gray-500 text-sm mb-6">Configurez l'ambiance souhaitée pour votre client.</p>
        
        <div className="space-y-6">
          {/* Plants */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Leaf size={16} className="text-green-600" /> Végétation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.values(PlantOption).map((option) => (
                <button
                  key={option}
                  onClick={() => handleChange('plants', option)}
                  className={`text-xs py-2 px-1 rounded-md border transition-all ${
                    options.plants === option
                      ? 'bg-green-50 border-green-500 text-green-700 font-medium ring-1 ring-green-500'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Decor Toggles */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <label className="text-sm font-semibold text-gray-700">Accessoires & Déco</label>
            
            {/* Decor Density Selector */}
             <div className="space-y-2 mb-4">
              <label className="text-xs text-gray-500 flex items-center gap-1">
                <Coffee size={12} /> Densité du Décor
              </label>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(DecorIntensity).map((intensity) => (
                  <button
                    key={intensity}
                    onClick={() => handleChange('decorIntensity', intensity)}
                    className={`text-[10px] sm:text-xs py-1.5 px-1 rounded-md border transition-all ${
                      options.decorIntensity === intensity
                        ? 'bg-orange-50 border-orange-400 text-orange-700 font-medium ring-1 ring-orange-400'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {intensity}
                  </button>
                ))}
              </div>
            </div>

            {/* Furniture / Kuizi Collection - NEW */}
            <div className="space-y-2 mb-4 bg-pink-50/50 p-2 rounded-lg border border-pink-100">
               <label className="text-xs text-pink-700 font-bold flex items-center gap-1">
                <Armchair size={12} /> Ajouter Assises (Collection Kuizi)
              </label>
              <div className="flex flex-col gap-2">
                {Object.values(FurnitureAddOption).map((furnOpt) => (
                   <button
                    key={furnOpt}
                    onClick={() => handleChange('furnitureAdd', furnOpt)}
                    className={`text-xs py-2 px-2 rounded-md border transition-all text-left ${
                      options.furnitureAdd === furnOpt
                        ? 'bg-white border-pink-500 text-pink-700 font-bold shadow-sm'
                        : 'bg-white/50 border-transparent text-gray-500 hover:bg-white'
                    }`}
                  >
                    {furnOpt}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <ImageIcon size={16} /> Décoration murale
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.wallDecor}
                  onChange={(e) => handleChange('wallDecor', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Utensils size={16} /> Ustensiles de cuisine
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.utensils}
                  onChange={(e) => handleChange('utensils', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-400"></div> Fruits
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.fruit}
                  onChange={(e) => handleChange('fruit', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            {/* Window Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <AppWindow size={16} className="text-blue-400" /> Vue Extérieure / Fenêtre
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.addWindowView}
                  onChange={(e) => handleChange('addWindowView', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            {/* Wall Modification */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <PaintBucket size={16} className="text-pink-500" /> Modifier murs/peinture
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.allowWallModification}
                  onChange={(e) => handleChange('allowWallModification', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            {/* NEW: Add Walls / Enclose Space */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <BrickWall size={16} className="text-stone-600" /> Ajouter des murs (Fermer)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.addWalls}
                  onChange={(e) => handleChange('addWalls', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

            {/* Floor Modification */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-ixina-blue/30 transition-colors">
              <span className="text-sm text-gray-600 flex items-center gap-2">
                <Grid2X2 size={16} className="text-amber-700" /> Modifier le sol
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.allowFloorModification}
                  onChange={(e) => handleChange('allowFloorModification', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ixina-blue"></div>
              </label>
            </div>

          </div>

           {/* Kitchen Finishes */}
           <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Layers size={16} className="text-slate-500" /> Finition des Façades
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {Object.values(KitchenFinish).map((finish) => (
                <button
                  key={finish}
                  onClick={() => handleChange('kitchenFinish', finish)}
                  className={`text-xs py-2 px-1 rounded-md border flex flex-col items-center gap-1 transition-all ${
                    options.kitchenFinish === finish
                      ? 'bg-slate-100 border-slate-500 text-slate-800 font-bold ring-1 ring-slate-500'
                      : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {finish === KitchenFinish.AUTO && <ScanFace size={14} />}
                  {finish === KitchenFinish.MATTE && <div className="w-3 h-3 rounded-full bg-gray-400 opacity-50 border border-gray-500" />}
                  {finish === KitchenFinish.GLOSSY && <Sparkles size={14} />}
                  {finish}
                </button>
              ))}
            </div>

            {/* Wood Texture Option - NEW */}
            <div className="space-y-2 mt-3">
              <label className="text-xs text-gray-500 flex items-center gap-1">
                <TreeDeciduous size={12} /> Texture Bois
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(WoodTextureOption).map((woodOpt) => (
                  <button
                    key={woodOpt}
                    onClick={() => handleChange('woodTexture', woodOpt)}
                    className={`text-[10px] py-1.5 px-1 rounded-md border transition-all ${
                      options.woodTexture === woodOpt
                        ? 'bg-amber-50 border-amber-500 text-amber-800 font-bold ring-1 ring-amber-500'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {woodOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* High Fidelity Details Option */}
            <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:border-slate-300 transition-colors bg-slate-50 mb-2 mt-2">
              <span className="text-xs text-slate-700 flex items-center gap-2 font-semibold">
                <Diamond size={14} className="text-cyan-600"/> Finition Haute Couture (Détail+)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.highFidelityDetails}
                  onChange={(e) => handleChange('highFidelityDetails', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-7 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-cyan-600"></div>
              </label>
            </div>

             {/* Framed Doors Option */}
             <div className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:border-slate-300 transition-colors bg-slate-50">
              <span className="text-xs text-slate-700 flex items-center gap-2">
                <Grid size={14} /> Accentuer les cadres (Shaker)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.enhanceFramedDoors}
                  onChange={(e) => handleChange('enhanceFramedDoors', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-7 h-4 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-slate-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-slate-600"></div>
              </label>
            </div>
          </div>

          {/* Lighting */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" /> Source d'éclairage
              </label>
              <select
                value={options.lighting}
                onChange={(e) => handleChange('lighting', e.target.value as LightingOption)}
                className="w-full text-sm p-2.5 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-ixina-blue focus:border-ixina-blue block"
              >
                {Object.values(LightingOption).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

             {/* Lighting Atmosphere - NEW */}
             <div className="space-y-2">
               <label className="text-xs text-gray-500 flex items-center gap-1">
                <Sun size={12} /> Ambiance Lumineuse
              </label>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(LightingAtmosphere).map((atmo) => (
                   <button
                    key={atmo}
                    onClick={() => handleChange('lightingAtmosphere', atmo)}
                    className={`text-[10px] py-1.5 px-2 rounded border transition-all flex items-center justify-center gap-1 ${
                      options.lightingAtmosphere === atmo
                        ? 'bg-amber-50 border-amber-400 text-amber-800 font-bold ring-1 ring-amber-400'
                        : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {atmo === LightingAtmosphere.EVENING ? <Moon size={10} /> : 
                     atmo === LightingAtmosphere.COSY ? <Coffee size={10} /> : <Sunset size={10} />}
                    {atmo.split('(')[0]} 
                  </button>
                ))}
              </div>
            </div>

            {/* Lighting Intensity Slider */}
            {options.lighting !== LightingOption.NO_CHANGE && (
              <div className="bg-yellow-50/50 p-3 rounded-lg border border-yellow-100 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex justify-between items-center text-xs text-gray-600 mb-1">
                  <span className="flex items-center gap-1 font-medium">
                    <Sun size={12}/> Intensité
                    <span className="text-gray-400 font-normal ml-1">
                      ({getIntensityLabel(options.lightingIntensity)})
                    </span>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-mono">
                    {options.lightingIntensity}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={options.lightingIntensity}
                  onChange={(e) => handleChange('lightingIntensity', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-ixina-blue"
                />
                <div className="flex justify-between text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                  <span>Min</span>
                  <span>Max</span>
                </div>
              </div>
            )}
          </div>

          {/* Perspective Option */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
             <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Camera size={16} className="text-teal-600" /> Perspective / Caméra
            </label>
            <div className="grid grid-cols-2 gap-2">
              {Object.values(PerspectiveType).map((type) => (
                <button
                  key={type}
                  onClick={() => handleChange('perspectiveType', type)}
                  className={`text-xs py-2 px-1 rounded-md border transition-all flex items-center justify-center gap-1 ${
                    options.perspectiveType === type
                      ? 'bg-teal-50 border-teal-500 text-teal-700 font-bold ring-1 ring-teal-500'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Resolution / Quality */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Monitor size={16} className="text-gray-500" /> Qualité & Résolution
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {Object.values(ResolutionOption).map((option) => (
                <button
                  key={option}
                  onClick={() => handleChange('resolution', option)}
                  className={`text-xs py-2 px-1 rounded-md border transition-all ${
                    options.resolution === option
                      ? 'bg-blue-50 border-ixina-blue text-ixina-blue font-bold ring-1 ring-ixina-blue'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>

             {/* Raytracing Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-purple-100 bg-purple-50 hover:border-purple-300 transition-colors mb-2">
              <span className="text-sm text-gray-800 flex items-center gap-2 font-medium">
                <Sparkles size={16} className="text-purple-600" /> Raytracing (Réaliste)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.raytracing}
                  onChange={(e) => handleChange('raytracing', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

             {/* Hyper-Realism Toggle */}
             <div className="flex items-center justify-between p-3 rounded-lg border border-indigo-100 bg-indigo-50 hover:border-indigo-300 transition-colors">
              <span className="text-sm text-gray-800 flex items-center gap-2 font-bold">
                <Aperture size={16} className="text-indigo-600" /> Mode Hyper-Réalisme (IA+)
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={options.hyperRealism}
                  onChange={(e) => handleChange('hyperRealism', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onGenerate}
          disabled={!hasImage || isGenerating}
          className={`w-full py-4 px-6 rounded-lg font-bold text-white shadow-lg transition-all transform flex items-center justify-center gap-3
            ${!hasImage || isGenerating 
              ? 'bg-gray-400 cursor-not-allowed opacity-70' 
              : 'bg-gradient-to-r from-ixina-blue to-blue-600 hover:scale-[1.02] hover:shadow-xl'
            }`}
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Génération en cours...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              GÉNÉRER LE RENDU
            </>
          )}
        </button>
        {!hasImage && <p className="text-xs text-red-500 mt-2 text-center">Veuillez d'abord importer une photo.</p>}
      </div>
    </div>
  );
};

export default Controls;