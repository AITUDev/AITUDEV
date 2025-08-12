import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import dbConnect from '@/lib/mongodb';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        console.log('Fetching member with ID:', id);

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid member ID' },
                { status: 400 }
            );
        }

        const db = await dbConnect();
        console.log('Database connected, querying  for member...');

        const member = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });
        console.log('Query result:', member ? 'Member found' : 'Member not found');

        if (!member) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                ...member,
                _id: member._id.toString(),
                startDate: member.startDate?.toISOString(),
                endDate: member.endDate?.toISOString(),
                createdAt: member.createdAt?.toISOString(),
                updatedAt: member.updatedAt?.toISOString(),
            }
        });

    } catch (error) {
        console.error('Error fetching member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch member .. try again' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid member ID' },
                { status: 400 }
            );
        }

        const db = await dbConnect();
        const formData = await request.formData();

        // Parse skills from form data (supports both JSON string and comma-separated)
        let skills: string[] = [];
        const skillsData = formData.get('skills')?.toString();
        if (skillsData) {
            try {
                // Try to parse as JSON first
                skills = JSON.parse(skillsData);
                if (!Array.isArray(skills)) {
                    // If not an array, try splitting by comma
                    skills = skillsData.split(',').map(s => s.trim()).filter(Boolean);
                }
            } catch (e) {
                // If JSON parsing fails, treat as comma-separated
                skills = skillsData.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
        
        const updateData: any = {
            name: formData.get('name') as string,
            role: formData.get('role') as string,
            email: formData.get('email') as string,
            bio: formData.get('bio') as string,
            status: formData.get('status') as string || 'active',
            skills,
            updatedAt: new Date(),
        };
        
        // Keep existing image if not updating
        const currentImage = formData.get('currentImage') as string;
        if (currentImage && !formData.get('image')) {
            updateData.image = JSON.parse(currentImage);
        }

        // Handle social links if they exist in the form
        const socialLinks = {} as Record<string, string>;
        const socialFields = ['github', 'twitter', 'linkedin', 'website'];

        socialFields.forEach(field => {
            const value = formData.get(`social.${field}`) as string;
            if (value) {
                socialLinks[field] = value;
            }
        });

        if (Object.keys(socialLinks).length > 0) {
            updateData.social = socialLinks;
        }

        const image = formData.get('image') as File;

        // Handle image upload if a new image is provided
        if (image && image.size > 0) {
            try {
                const bytes = await image.arrayBuffer();
                const buffer = Buffer.from(bytes);
                const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;

                const { uploadImage } = await import('@/lib/cloudinary');
                const uploadResult = await uploadImage(base64);

                updateData.image = {
                    url: uploadResult.secure_url,
                    publicId: uploadResult.public_id,
                };
            } catch (error) {
                console.error('Error uploading image:', error);
                return NextResponse.json(
                    { success: false, error: 'Failed to upload image' },
                    { status: 500 }
                );
            }
        }

        const result = await db.collection('teammembers').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        const updatedMember = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });

        return NextResponse.json({
            success: true,
            data: {
                ...updatedMember,
                _id: updatedMember?._id.toString(),
                startDate: updatedMember?.startDate?.toISOString(),
                endDate: updatedMember?.endDate?.toISOString(),
                createdAt: updatedMember?.createdAt?.toISOString(),
                updatedAt: updatedMember?.updatedAt?.toISOString(),
            }
        });

    } catch (error) {
        console.error('Error updating member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update member' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid member ID' },
                { status: 400 }
            );
        }

        const db = await dbConnect();

        // Get member first to delete its image from Cloudinary if it exists
        const member = await db.collection('teammembers').findOne({ _id: new ObjectId(id) });

        if (!member) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        // Delete image from Cloudinary if it exists
        if (member.image?.publicId) {
            try {
                const { deleteImage } = await import('@/lib/cloudinary');
                await deleteImage(member.image.publicId);
            } catch (error) {
                console.error('Error deleting image from Cloudinary:', error);
                // Continue with member deletion even if image deletion fails
            }
        }

        // Delete the member
        const result = await db.collection('teammembers').deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { success: false, error: 'Member not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Member deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting member:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete member' },
            { status: 500 }
        );
    }
}