import { styled } from '@mui/material/styles';
import { FC, useState } from 'react';
import { Box, Menu, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import useObject from '../../../hooks/useObject';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type props = {
    fullWidth?: boolean
    multiple?: boolean
}

const InputFileUpload: FC<props> = ({ fullWidth, multiple }) => {
    const { addFiles } = useObject();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <div>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    startIcon={<AddIcon />}
                    fullWidth={fullWidth}
                >
                    New
                </Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    <MenuItem onClick={handleClose}>
                        <Box
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            sx={{ cursor: "pointer" }}
                        >
                            New Folder
                        </Box>
                    </MenuItem>
                    <MenuItem>
                        <Box
                            component="label"
                            role={undefined}
                            tabIndex={-1}
                            sx={{ cursor: "pointer" }}
                        >
                            Upload file
                            <VisuallyHiddenInput type="file" multiple={multiple} onChange={(e) => {
                                addFiles(e.target.files);
                                handleClose();
                            }} />
                        </Box>
                    </MenuItem>
                </Menu>
            </div>
        </>
    );
}

export default InputFileUpload;