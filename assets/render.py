import bpy
import mathutils

file_prefix = '/Users/bastian/projekte/laserchess/src/render/img/'
camera = bpy.context.scene.objects.get("Camera")
camera_z = camera.location.z

def render_piece(rank, file, color, type):
    # TODO Set view layer to Pieces Only
    # TODO Select object to be rendered and hide everything else, then unhide after rendering
    orig_cam_x = camera.location.x
    orig_cam_y = camera.location.y
    # 76 x 76 for pieces (80 x 80 for board tiles)
    bpy.data.scenes[0].render.resolution_x = 76
    bpy.data.scenes[0].render.resolution_y = 76
    camera.location.x = 1 + (file - 1) * 2
    camera.location.y = 1 + (rank - 1) * 2
    bpy.data.scenes[0].render.filepath = '/Users/bastian/projekte/laserchess/src/render/img/' + color + '_' + type + '.png'
    bpy.ops.render.render(write_still=True)
    camera.location.x = orig_cam_x
    camera.location.y = orig_cam_y
    
print('Starting: render pieces')
    
#render_piece(1, 1, 'white', 'rook')
#render_piece(1, 2, 'white', 'knight')
#render_piece(1, 3, 'white', 'bishop')
#render_piece(1, 4, 'white', 'king')
#render_piece(1, 5, 'white', 'queen')
#render_piece(1, 6, 'white', 'laser')

#render_piece(2, 1, 'white', 'pawn_shield')
#render_piece(2, 2, 'white', 'pawn_90_degrees')
#render_piece(2, 3, 'white', 'pawn_threeway')

#render_piece(3, 1, 'black', 'rook')
#render_piece(3, 2, 'black', 'knight')
#render_piece(3, 3, 'black', 'bishop')
#render_piece(3, 4, 'black', 'king')
#render_piece(3, 5, 'black', 'queen')
#render_piece(3, 6, 'black', 'laser')

#render_piece(4, 1, 'black', 'pawn_shield')
#render_piece(4, 2, 'black', 'pawn_90_degrees')
#render_piece(4, 3, 'black', 'pawn_threeway')

print('Done: render pieces')

# set absolute location
# bpy.context.scene.objects.get("Camera").location.x = 0

# set location relative (see below for moving selected object in a more complicated way)
# bpy.context.scene.objects.get("Camera")..location.x += 3.0

# deselect all
# bpy.ops.object.select_all(action='DESELECT')

# select camera
# bpy.context.scene.objects.get("Camera").select_set(True)

# move selected object relative
# bpy.ops.transform.translate(
#    value=(-2, 0, 0),  
#    orient_type='GLOBAL', 
#    orient_matrix=((1, 0, 0), (0, 1, 0), (0, 0, 1)), 
#    orient_matrix_type='GLOBAL', 
#    constraint_axis=(True, False, False), 
#    mirror=True, 
#    use_proportional_edit=False, 
#    proportional_edit_falloff='SMOOTH', 
#    proportional_size=1, 
#    use_proportional_connected=False, 
#    use_proportional_projected=False
#)
