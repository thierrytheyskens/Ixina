

import { GoogleGenAI } from "@google/genai";
import { EnhancementOptions, PlantOption, LightingOption, ResolutionOption, KitchenFinish, WoodTextureOption, DecorIntensity, PerspectiveType, LightingAtmosphere, FurnitureAddOption } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a Base64 string suitable for the Gemini API.
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const enhanceKitchenImage = async (
  base64Image: string,
  options: EnhancementOptions
): Promise<string> => {
  
  // Construct the prompt using English for better model adherence
  // STRATEGY CHANGE: ACT AS A PHOTO RETOUCHER, NOT A 3D GENERATOR
  // This prevents the AI from "inventing" new furniture to fill space.
  let prompt = `
    ROLE: PROFESSIONAL INTERIOR PHOTO RETOUCHER (POST-PROCESSING ONLY).
    TASK: Apply a "High-End Luxury Finishes" filter to the EXISTING image.
    
    *** ABSOLUTE PRIME DIRECTIVE: GEOMETRY IS FROZEN ***
    You are NOT an architect. You are NOT allowed to add, remove, or move furniture.
    You are processing a flat 2D image. You can only change TEXTURES, LIGHTING, and SHADOWS.
    
    CRITICAL CONSTRAINT - THE "NO ARCHITECT" RULE:
    1. **NO NEW FURNITURE**: If there is an empty wall, IT MUST STAY EMPTY. Do NOT add cabinets, shelves, or paintings to fill the void.
    2. **NO LAYOUT CHANGES**: The outline/silhouette of the kitchen MUST match the original image pixel-for-pixel.
    3. **DRAWER VS DOOR**: If a unit has horizontal lines (drawers), it stays drawers. If it has vertical lines (doors), it stays doors.
    4. **NO EXTENSIONS**: Do not extend the countertop. Do not add an island if there isn't one.

    What you MUST do (THE "RETOUCHING"):
    - **RE-LIGHT**: Change the lighting to be more photorealistic (Raytracing simulation).
    - **RE-TEXTURE**: Upgrade the quality of the materials (make the wood look real, make the stone look heavy).
    - **COLOR GRADING**: Apply a high-end magazine color grade.

    STRICT PROHIBITIONS (COLOR & STYLE):
    - **COLOR PRESERVATION IS SACRED**: 
      - The cabinet color (Hex code) MUST remain EXACTLY the same. 
      - The countertop material MUST remain EXACTLY the same.
    - **NO FACADE ORNAMENTATION**: 
      - ABSOLUTELY NO new moldings, carvings, or patterns on the doors unless "Framed Doors" option is explicitly enabled below.
      - Keep surfaces clean and modern if they are currently clean and modern.
    - **PRESERVE APPLIANCES**: 
      - The COOKING HOB (Induction/Gas), SINK, TAP, OVEN, and HOOD must stay exactly where they are. DO NOT REMOVE THEM.

    VISUAL ENHANCEMENTS REQUIRED:
    - **PHOTOREALISM**: The image must look like a photograph, not a 3D model.
    - **ANTI-PLASTICITY**: Add subtle imperfections, micro-grain, and "orange peel" texture to surfaces so they don't look like perfect CGI plastic.
    - **RADIOSITY & LIGHT BOUNCE**: Simulate how light bounces off the floor onto the cabinets.
    - **CONTACT SHADOWS**: Deepen shadows where objects touch (Ambient Occlusion) to ground the furniture.
  `;
  
  // Wood Texture Handling
  if (options.woodTexture === WoodTextureOption.ENHANCED) {
    prompt += `
      - **WOOD TEXTURE BOOST (CRITICAL)**: Any wood surface (cabinets, floor, countertop) must look ORGANIC and TACTILE. 
      - Simulate "brushed wood" or "open pore" texture. 
      - The grain must have relief and depth. It must NOT look like a flat printed sticker. 
      - Accentuate the contrast of the veins to give it a raw, premium look.\n`;
  } else {
    prompt += `
      - **WOOD TEXTURE**: Keep wood looking natural and realistic. Ensure it has proper sheen but do not artificially exaggerate the grain.\n`;
  }

  // Lighting Atmosphere Logic
  prompt += `\nLIGHTING & ATMOSPHERE SETTINGS:\n`;
  switch (options.lightingAtmosphere) {
    case LightingAtmosphere.MORNING:
      prompt += `- **ATMOSPHERE**: Cool, fresh morning light. Color temperature approx 5500K. Soft, diffused shadows. Sense of cleanliness and new beginnings.\n`;
      break;
    case LightingAtmosphere.GOLDEN_HOUR:
      prompt += `- **ATMOSPHERE**: Golden Hour (Sun). Warm, directional sunlight entering the room. Color temperature approx 3500K. Long, dramatic shadows. Very cozy and emotional feeling.\n`;
      break;
    case LightingAtmosphere.COSY:
      prompt += `- **ATMOSPHERE**: COSY / HYGGE / COCOONING. Very warm, soft, and enveloping light (approx 3000K). Low contrast. Feeling of comfort and relaxation. Focus on warm wood tones and inviting shadows. Makes the kitchen feel like the heart of the home.\n`;
      break;
    case LightingAtmosphere.EVENING:
      prompt += `- **ATMOSPHERE**: Chic Evening / Night. Artificial lighting dominance. Moody contrast. Warm pools of light from lamps (2700K) against a dark blue exterior window tone. Luxury lounge vibe.\n`;
      break;
    case LightingAtmosphere.NEUTRAL:
    default:
      prompt += `- **ATMOSPHERE**: Professional Studio Lighting. Neutral white balance (4500K). Evenly lit, no harsh shadows, perfect for product visualization. **MAINTAIN TRUE COLORS**.\n`;
      break;
  }

  // Perspective / Camera Angle Handling
  if (options.perspectiveType === PerspectiveType.IMMERSIVE) {
    prompt += `- CAMERA PERSPECTIVE: **TILT-SHIFT LENS SIMULATION**. Use a 16-24mm wide-angle lens but keep vertical lines perfectly straight (Architectural 2-point perspective). Open up the space. Make it feel expansive.\n`;
  } else {
    prompt += `- CAMERA PERSPECTIVE: STRICTLY KEEP the original camera angle and focal length. Do not distort the room geometry. Keep the view natural.\n`;
  }

  // Decor Intensity & Cleanliness Policy
  if (options.decorIntensity === DecorIntensity.MINIMAL) {
     prompt += `
    - **MINIMALIST STYLE (STRICT)**: 
      - The client wants a "Showroom" look. 
      - Surfaces must be IMPRECULATELY CLEAN. 
      - ZERO RANDOM CLUTTER. Do NOT add jars, bowls, bottles, or appliances unless specifically requested below.
      - If no specific decor options are checked, the countertop must be EMPTY of loose objects.
      - **EXCEPTION**: BUILT-IN ELEMENTS (COOKING HOB, SINK, TAP) ARE NOT CLUTTER. THEY MUST BE PRESERVED.\n`;
  } else if (options.decorIntensity === DecorIntensity.MAXIMAL) {
     prompt += `
    - **LIVED-IN / ACCENTUATED STYLE**: 
      - The client wants a warm, inhabited, and "alive" kitchen. 
      - In addition to requested items, you are AUTHORIZED to add tasteful "lifestyle" props to accent the scene (e.g., an open cookbook, a coffee cup, a nice bottle of olive oil, a folded tea towel).
      - Make the kitchen look active and loved, not sterile.\n`;
  } else {
     // Balanced
     prompt += `
    - **BALANCED STYLE**: 
      - Keep it tidy but natural. 
      - Do not add excessive clutter, but do not make it look sterile.
      - Follow the specific decor requests below strictly.\n`;
  }

  // Furniture Addition (Kuizi Collection)
  // This overrides the "No Furniture" rule specifically for staging.
  if (options.furnitureAdd === FurnitureAddOption.STOOLS) {
    prompt += `
    - **FURNITURE EXCEPTION - ADD BAR STOOLS**: The user specifically requests to stage the kitchen with bar stools.
      - DETECT: Look for a kitchen island, peninsula, or bar counter.
      - ACTION: Place 2 or 3 modern bar stools (Kuizi Collection style) aligned with the counter.
      - STYLE: "Kuizi Yumi/Alto/Ronda" style. Sleek design, black thin metal legs (epoxy), fabric or velvet seat (beige, cognac, or grey). 
      - REALISM: Ensure they cast correct contact shadows on the floor.
    \n`;
  } else if (options.furnitureAdd === FurnitureAddOption.CHAIRS) {
    prompt += `
    - **FURNITURE EXCEPTION - ADD DINING CHAIRS**: The user specifically requests to stage the kitchen with dining chairs.
      - DETECT: Look for a dining table or an open dining area.
      - ACTION: Place modern dining chairs (Kuizi Collection style) around the table.
      - STYLE: "Kuizi Yumi/Alto/Ronda" style. Modern silhouette, black metal legs, comfortable fabric upholstery (terracotta, green, or grey).
      - REALISM: Ensure they fit the perspective and scale of the room.
    \n`;
  }

  // Window Handling
  if (options.addWindowView) {
     prompt += `- WINDOWS & VIEWS: Check for existing windows. If present, generate a beautiful, realistic outdoor view matching the lighting atmosphere. If the wall looks empty and it fits the composition, you ARE ALLOWED to creatively add a modern window to bring in natural light.\n`;
  } else {
     prompt += `- STRICT RULE: DO NOT ADD NEW WINDOWS. Keep the existing walls solid. If a window is already present, you can clean up the view, but DO NOT create new openings in walls.\n`;
  }

  // Wall Modification Logic
  if (options.allowWallModification) {
     prompt += `- WALLS REDESIGN AUTHORIZED: You are PERMITTED to change the wall color or texture (e.g., modern paint, soft concrete, elegant wallpaper) to better match the kitchen design.
       - IMPORTANT: The new wall style MUST harmonize perfectly with the kitchen cabinet colors and the countertop. Create a cohesive, high-end interior design palette.\n`;
  } else {
     prompt += `- STRICT RULE: DO NOT change the material, color, or texture of the existing walls. You may only improve the lighting interactions on them.\n`;
  }
  
  // Add Walls / Enclose Space Logic
  if (options.addWalls) {
    prompt += `- **ADD STRUCTURAL WALLS / ENCLOSE SPACE**: The client wants a fully enclosed room.
      - If the photo shows an open plan, undefined edges, or empty void space around the kitchen, **GENERATE REALISTIC WALLS** to close the room.
      - Make the kitchen feel like a dedicated, enclosed architectural space.
      - Ensure the new walls match the style of existing walls.\n`;
  } else {
    prompt += `- KEEP LAYOUT OPENNESS: Do not arbitrarily add walls if the space is designed to be open-plan. Respect the current structural boundaries.\n`;
  }

  // Floor Modification Logic
  if (options.allowFloorModification) {
     prompt += `- FLOORS REDESIGN AUTHORIZED: You are PERMITTED to change the floor material (e.g., modern large tiles, warm wood parquet, polished concrete) to better match the high-end kitchen design.
       - IMPORTANT: The new floor MUST harmonize perfectly with the kitchen cabinet colors. If the current floor is ugly or dated, replace it with a premium material.\n`;
  } else {
     prompt += `- STRICT RULE: DO NOT change the material, color, or texture of the existing floor tiles/parquet. Keep the original flooring exactly as is.\n`;
  }

  // Kitchen Fronts Enhancement & Finish Handling
  prompt += `- KITCHEN FRONTS FACADES & FINISH:\n`;
  
  // High Fidelity Logic - Highest Priority
  if (options.highFidelityDetails) {
    prompt += `  - **ULTRA-HIGH FIDELITY MATERIAL PASS**:
      - Treat the kitchen fronts as if they are being photographed for a catalog close-up.
      - **CRITICAL: DO NOT CHANGE THE COLOR**: Sample the exact original color (albedo) of the furniture and preserve it 100%. The hue must not shift.
      - **TEXTURE UPSCALING**: Add micro-surface details (invisible to the naked eye but perceptible) like subtle grain, slight coating irregularities, or "orange peel" effect if appropriate, to make it look real.
      - **EDGE DEFINITION**: Make every edge of the doors razor-sharp and perfectly defined. Add subtle chamfered edges to catch light highlights.\n`;
  }

  // Finish Logic
  if (options.kitchenFinish === KitchenFinish.MATTE) {
     prompt += `  - **FORCE MATTE FINISH**: The client specifically requested a MATTE / SATIN finish.
       - REMOVE all sharp reflections from cabinet doors.
       - Use a soft, velvety light diffusion ("Soft Touch" or "Fenix" material style).
       - Ensure the color remains deep and rich, but without gloss.\n`;
  } else if (options.kitchenFinish === KitchenFinish.GLOSSY) {
     prompt += `  - **FORCE HIGH-GLOSS FINISH**: The client specifically requested a GLOSSY / LACQUERED finish.
       - Add sharp, mirror-like reflections (Fresnel effect) to all cabinet fronts.
       - The surfaces should look like polished glass or high-end glossy lacquer.
       - Make the environment reflect clearly on the doors.\n`;
  } else {
     // AUTO / Default
     prompt += `  - **ENHANCE EXISTING FINISH**: Look at the original image.
       - If it looks MATTE, keep it velvety smooth.
       - If it looks GLOSSY, clean up the reflections to make them sharp.
       - generally improve the material quality to look "Showroom New".\n`;
  }
  
  if (options.enhanceFramedDoors) {
     prompt += `  - **FRAMED / SHAKER DOORS ENHANCEMENT**: 
       - If the kitchen has framed doors (Shaker style), DRASTICALLY increase the contrast and sharpness of the frame edges.
       - Deepen the shadows in the recesses to show depth.
       - Make the molding lines crisp and architectural.
       - Ensure the separation between the frame and the center panel is clearly visible.\n`;
  } else {
     prompt += `  - **KEEP FACADES FLAT/CLEAN**: Do NOT add frames or moldings if they are not present in the original image. Maintain the original style.
       - Do NOT change Solid doors to Glass doors.\n`;
  }

  // General Fronts improvement
  prompt += `  - Ensure the gaps (reveal lines) between drawers and doors are sharp and dark to define the geometry clearly.\n`;


  // Raytracing / Advanced Rendering
  if (options.raytracing) {
    prompt += `- ACTIVATE RAYTRACING: Enable physically based rendering (PBR). Focus specifically on the COUNTERTOP and FACADES to render accurate caustics, contact shadows, and reflections of the environment on their surfaces.\n`;
    prompt += `- Use a highly realistic Global Illumination model similar to Unreal Engine 5 Lumen or V-Ray.\n`;
  }

  // Hyper-Realism Mode
  if (options.hyperRealism) {
    prompt += `- **HYPER-REALISM MODE ACTIVATED**:
      - Treat this image as an award-winning interior design photograph.
      - CAMERA SETTINGS: Simulate a Sony A7R IV camera with a prime GM lens.
      - ISO 100, Aperture f/8 for maximum sharpness.
      - LIGHTING PHYSICS: Simulate complex photon bouncing (indirect lighting) to light up corners naturally.
      - TEXTURE DETAIL: Every surface (wood, stone, metal) must display microscopic texture details (imperfections, grain, pores) to avoid the "smooth CG look".
      - VOLUMETRIC LIGHTING: Add subtle air density/dust particles in light shafts if applicable for mood.
      - Apply professional color grading: High dynamic range (HDR), rich blacks, detailed highlights.\n`;
  }

  // Quality Adjustments based on Resolution setting
  if (options.resolution === ResolutionOption.LOW) {
    prompt += `- Create a fast draft render with standard lighting.\n`;
  } else if (options.resolution === ResolutionOption.MEDIUM) {
    prompt += `- Create a high-quality, sharp, and well-balanced render.\n`;
  } else if (options.resolution === ResolutionOption.HIGH) {
    prompt += `- Create an ULTRA-HIGH DEFINITION (4K) render with extremely fine texture details, complex reflections, and luxury magazine lighting.\n`;
  }

  prompt += `\nDECORATIVE ADDITIONS REQUESTED BY USER:\n`;

  // Add specific user options to the prompt
  if (options.plants === PlantOption.LITTLE) {
    prompt += `- Add a few small, discreet green plants on the countertop or shelves.\n`;
  } else if (options.plants === PlantOption.LOT) {
    prompt += `- Add abundant vegetation: hanging plants, herb pots, lush green plants for an "Urban Jungle" ambiance.\n`;
  } else {
    prompt += `- STRICTLY NO PLANTS. Remove any hallucinations of plants.\n`;
  }

  if (options.wallDecor) {
    prompt += `- Add elegant wall decor (frames, modern clock) on empty walls, without cluttering.\n`;
  } else {
    prompt += `- Leave walls without additional decoration. Keep them clean.\n`;
  }

  if (options.utensils) {
    prompt += `- Place realistic kitchen utensils (spatula pot, cutting board, premium food processor) on the countertop.\n`;
  } else {
    prompt += `- DO NOT add any kitchen utensils, appliances, or countertop accessories (unless authorized by 'Lived-In Style' above).\n`;
  }

  if (options.fruit) {
    prompt += `- Add a basket of colorful fresh fruit on the island or countertop.\n`;
  } else {
    prompt += `- DO NOT add any food or fruit.\n`;
  }

  if (options.lighting === LightingOption.RECESSED) {
    let intensityDesc = "";
    if (options.lightingIntensity < 30) {
      intensityDesc = "soft, dimmed, warm light (cozy atmosphere)";
    } else if (options.lightingIntensity < 70) {
      intensityDesc = "powerful, natural, and balanced lighting";
    } else {
      intensityDesc = "very bright, intense, and vivid lighting (daylight type)";
    }
    prompt += `- Add/Simulate modern recessed lighting (LED spots on ceiling) producing ${intensityDesc}.\n`;
  
  } else if (options.lighting === LightingOption.LAMPS) {
    let intensityDesc = "";
    if (options.lightingIntensity < 30) {
      intensityDesc = "diffusing a soft and cozy ambient light";
    } else if (options.lightingIntensity < 70) {
      intensityDesc = "illuminating the room clearly and optimally";
    } else {
      intensityDesc = "with powerful bulbs for maximum brightness";
    }
    prompt += `- Add aesthetic modern pendant lights or lamps (not recessed) to the ceiling, ${intensityDesc}.\n`;
  }

  // APPLIANCE PRESERVATION PROTOCOL
  prompt += `
    \n**FINAL VERIFICATION STEP - APPLIANCE & GEOMETRY PRESERVATION**:
    - Locate the COOKING HOB (PLATING/STOVETOP) on the countertop. You MUST RENDER IT. Do not flatten it into the countertop material.
    - Locate the SINK and TAP. Ensure they are metallic/ceramic and distinct from the worktop.
    - Locate the OVEN and MICROWAVE. Keep their glass/metal texture distinct.
    - **GEOMETRY CHECK**: Ensure that drawers are still drawers and doors are still doors.
    - **DOUBLE CHECK COLORS**: Ensure the cabinets and countertop colors are identical to the input image.
  `;

  prompt += `
    Generate the final result in photorealistic high definition.
  `;

  // Configure Model and Settings based on Resolution
  let modelName = 'gemini-2.5-flash-image'; // Default (Fast, good for Low/Medium)
  
  // Base configuration - apply aspect ratio to ALL models to match UI
  let generationConfig: any = {
    imageConfig: {
      aspectRatio: '4:3'
    }
  };

  if (options.resolution === ResolutionOption.HIGH) {
    // Use Pro model for High resolution to support 2K/4K config
    modelName = 'gemini-3-pro-image-preview';
    // Add imageSize for Pro model
    generationConfig.imageConfig.imageSize = '2K';
  }

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg', // Assuming JPEG, standard for photo uploads
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: generationConfig,
    });

    // Extract the image from the response
    // Iterate to find the inlineData
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
           return part.inlineData.data;
        }
      }
    }
    
    throw new Error("Aucune image n'a été générée par le modèle.");

  } catch (error) {
    console.error("Erreur lors de la génération:", error);
    throw error;
  }
};